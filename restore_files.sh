#!/bin/bash

# Input file containing the list of files to restore
INPUT_FILE="cypress_deleted_files.txt"

# Check if the input file exists
if [ ! -f "$INPUT_FILE" ]; then
  echo "Error: $INPUT_FILE not found!"
  exit 1
fi

# Ensure the repository is clean
if [ -n "$(git status --porcelain)" ]; then
  echo "Warning: Working directory is not clean. Please commit or stash changes before running."
  exit 1
fi

# Set a high rename limit to handle large repositories
git config diff.renameLimit 50000

# Loop through each file in the list
while IFS= read -r file; do
  if [ -n "$file" ]; then
    echo "Processing $file..."
    # Find the most recent commit containing the file, following renames
    most_recent_commit_info=$(git log --all --full-history --follow --name-status --format="%H %ct %s" -- "$file" | grep -E "^[0-9a-f]{40}|^R" | sort -k2 -nr | head -n2)
    most_recent_commit=$(echo "$most_recent_commit_info" | grep -E "^[0-9a-f]{40}" | awk '{print $1}')
    
    if [ -n "$most_recent_commit" ]; then
      # Check if the file was renamed
      rename_line=$(echo "$most_recent_commit_info" | grep "^R")
      if [ -n "$rename_line" ]; then
        # Extract the new file path (after rename)
        new_path=$(echo "$rename_line" | awk '{print $NF}')
        echo "$file was renamed to $new_path in commit $most_recent_commit"
        file_to_restore="$new_path"
      else
        file_to_restore="$file"
      fi

      # Verify the file exists in the commit
      if git ls-tree -r "$most_recent_commit" -- "$file_to_restore" | grep -q .; then
        # Check if the file already exists in the working directory
        if [ -f "$file_to_restore" ]; then
          current_blob=$(git hash-object "$file_to_restore" 2>/dev/null)
          commit_blob=$(git ls-tree "$most_recent_commit" -- "$file_to_restore" | awk '{print $3}')
          if [ "$current_blob" = "$commit_blob" ]; then
            echo "$file_to_restore already exists in working directory and matches the most recent version in commit $most_recent_commit. Skipping."
            continue
          else
            echo "$file_to_restore exists in working directory but differs from the most recent version in commit $most_recent_commit."
            echo "Backing up existing file to $file_to_restore.bak..."
            mv "$file_to_restore" "$file_to_restore.bak"
          fi
        fi

        echo "Restoring $file_to_restore from commit $most_recent_commit..."
        # Attempt to restore the file
        git checkout "$most_recent_commit" -- "$file_to_restore" 2>error.log
        if [ $? -eq 0 ]; then
          echo "Successfully restored $file_to_restore from commit $most_recent_commit"
        else
          echo "Failed to restore $file_to_restore from commit $most_recent_commit. Error:"
          cat error.log
          # Try restoring from a branch containing the commit
          branch=$(git branch --all --contains "$most_recent_commit" | grep -v HEAD | head -n1 | sed 's/.* //')
          if [ -n "$branch" ]; then
            echo "Attempting to restore $file_to_restore from branch $branch..."
            git checkout "$branch" -- "$file_to_restore" 2>error.log
            if [ $? -eq 0 ]; then
              echo "Successfully restored $file_to_restore from branch $branch"
            else
              echo "Failed to restore $file_to_restore from branch $branch. Error:"
              cat error.log
            fi
          else
            echo "No branch found containing commit $most_recent_commit."
          fi
        fi
      else
        echo "File $file_to_restore not found in commit $most_recent_commit. Possible rename or history issue."
        echo "Checking for similar files in commit $most_recent_commit..."
        git ls-tree -r "$most_recent_commit" -- "$(dirname "$file_to_restore")" | grep -i "$(basename "$file_to_restore")"
      fi
    else
      echo "$file was never tracked by Git."
    fi
  fi
done < "$INPUT_FILE"

# Clean up error log
rm -f error.log

# Reset the rename limit to default (optional)
git config --unset diff.renameLimit

echo "Restoration complete. Check your working directory."
