# Work Log Integration - Wireframes

## 1. Work Log Dashboard (Main Page)

```
┌─────────────────────────────────────────────────────────────────────┐
│ PERFORMANT LABS                                    [User Menu ▼]    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Work Log Dashboard                                                  │
│  ══════════════════                                                  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Summary Statistics                                           │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                               │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │  │
│  │  │ This Week   │  │ This Month  │  │ Total Hours │          │  │
│  │  │             │  │             │  │             │          │  │
│  │  │   12.5 hrs  │  │   45.0 hrs  │  │  127.5 hrs  │          │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘          │  │
│  │                                                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Quick Filters (applies to all statistics below)             │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  Date Range: [Start Date ▼] to [End Date ▼]                 │  │
│  │  Project:    [All Projects ▼]                                │  │
│  │  Category:   [All Categories ▼]                              │  │
│  │              [Apply Filters]  [Clear All Filters]            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  ℹ️ Showing: All Projects, All Categories, All Time          │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌────────────────────────┐  ┌────────────────────────────────┐   │
│  │  Hours by Project      │  │  Hours by Category             │   │
│  ├────────────────────────┤  ├────────────────────────────────┤   │
│  │                        │  │                                │   │
│  │  ATK:         65.5 hrs │  │  Development:      98.0 hrs    │   │
│  │  PL Website:  42.0 hrs │  │  Meetings:         15.5 hrs    │   │
│  │  Internal:    20.0 hrs │  │  Admin:             8.0 hrs    │   │
│  │                        │  │  Research:          6.0 hrs    │   │
│  │  [View Details →]      │  │  [View Details →]              │   │
│  └────────────────────────┘  └────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Recent Work Logs                                             │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  Date       │ Title              │ Project    │ Hours │ Cat. │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  Apr 16     │ ATK Release 2.1    │ ATK        │  9.0  │ Dev  │  │
│  │  Apr 16     │ New website        │ PL Website │  2.5  │ Dev  │  │
│  │  Apr 16     │ ATK Release 2.1    │ ATK        │  1.0  │ Dev  │  │
│  │  Apr 15     │ Client meeting     │ ATK        │  1.5  │ Meet │  │
│  │  Apr 15     │ Code review        │ PL Website │  2.0  │ Dev  │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                          [Read More →]        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## 2. Work Log List (Full Table View)

```
┌─────────────────────────────────────────────────────────────────────┐
│ PERFORMANT LABS                                    [User Menu ▼]    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Work Logs                                    [← Back to Dashboard] │
│  ══════════                                                          │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Filters                                                      │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  Search: [________________]  🔍                               │  │
│  │  Date Range: [Start ▼] to [End ▼]                            │  │
│  │  Project: [All ▼]  Category: [All ▼]                         │  │
│  │  [Apply]  [Reset]                         Export: [CSV ▼]    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Showing 1-25 of 127 entries                                  │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  Date ▼    │ Title ▲          │ Project ▼  │ Category │ Hrs  │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  2026-04-16│ ATK Release 2.1  │ ATK        │ Dev      │ 9.0  │  │
│  │  2026-04-16│ New website      │ PL Website │ Dev      │ 2.5  │  │
│  │  2026-04-16│ ATK Release 2.1  │ ATK        │ Dev      │ 1.0  │  │
│  │  2026-04-15│ Client meeting   │ ATK        │ Meeting  │ 1.5  │  │
│  │  2026-04-15│ Code review      │ PL Website │ Dev      │ 2.0  │  │
│  │  2026-04-15│ Sprint planning  │ ATK        │ Meeting  │ 2.0  │  │
│  │  2026-04-14│ Bug fixes        │ ATK        │ Dev      │ 4.5  │  │
│  │  2026-04-14│ Documentation    │ PL Website │ Research │ 1.5  │  │
│  │  2026-04-13│ Feature dev      │ ATK        │ Dev      │ 6.0  │  │
│  │  2026-04-13│ Email responses  │ Internal   │ Admin    │ 0.5  │  │
│  │  ...                                                          │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  [◄ Previous]  [1] [2] [3] [4] [5] ... [13]  [Next ►]              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## 3. Weekly Summary View

```
┌─────────────────────────────────────────────────────────────────────┐
│ PERFORMANT LABS                                    [User Menu ▼]    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Weekly Summary                               [← Back to Dashboard] │
│  ═══════════════                                                     │
│                                                                      │
│  Week of: [Apr 14 - Apr 20, 2026 ▼]                                │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Week Overview                                                │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                               │  │
│  │  Total Hours: 42.5                                            │  │
│  │  Billable:    38.0 (89%)                                      │  │
│  │  Non-billable: 4.5 (11%)                                      │  │
│  │                                                               │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │ Hours by Day (Bar Chart)                               │  │  │
│  │  │                                                         │  │  │
│  │  │ 10│                                                     │  │  │
│  │  │  9│           ██                                        │  │  │
│  │  │  8│           ██        ██                              │  │  │
│  │  │  7│     ██    ██        ██                              │  │  │
│  │  │  6│     ██    ██        ██    ██                        │  │  │
│  │  │  5│     ██    ██        ██    ██                        │  │  │
│  │  │  4│     ██    ██    ██  ██    ██                        │  │  │
│  │  │  3│     ██    ██    ██  ██    ██    ██                  │  │  │
│  │  │  2│     ██    ██    ██  ██    ██    ██                  │  │  │
│  │  │  1│     ██    ██    ██  ██    ██    ██                  │  │  │
│  │  │  0└─────────────────────────────────────────────────    │  │  │
│  │  │     Mon   Tue   Wed   Thu   Fri   Sat   Sun            │  │  │
│  │  │     6.5   9.0   4.5   8.0   6.5   3.0   0.0            │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Hours by Project                                             │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  Project      │ Mon │ Tue │ Wed │ Thu │ Fri │ Sat │ Total   │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  ATK          │ 4.0 │ 6.5 │ 2.0 │ 5.5 │ 4.0 │ 2.0 │ 24.0    │  │
│  │  PL Website   │ 2.0 │ 2.5 │ 2.5 │ 2.5 │ 2.5 │ 1.0 │ 13.0    │  │
│  │  Internal     │ 0.5 │ 0.0 │ 0.0 │ 0.0 │ 0.0 │ 0.0 │  0.5    │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  TOTAL        │ 6.5 │ 9.0 │ 4.5 │ 8.0 │ 6.5 │ 3.0 │ 37.5    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Hours by Category                                            │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  Development:  32.0 hrs  ████████████████████████████░░░░    │  │
│  │  Meetings:      3.5 hrs  ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░    │  │
│  │  Admin:         1.5 hrs  ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    │  │
│  │  Research:      0.5 hrs  █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  [Export Weekly Report]  [◄ Previous Week]  [Next Week ►]          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## 4. Monthly Report View

```
┌─────────────────────────────────────────────────────────────────────┐
│ PERFORMANT LABS                                    [User Menu ▼]    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Monthly Report                               [← Back to Dashboard] │
│  ═══════════════                                                     │
│                                                                      │
│  Month: [April 2026 ▼]                                              │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Month Overview                                               │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                               │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │  │
│  │  │ Total    │  │ Avg/Day  │  │ Projects │  │ Entries  │     │  │
│  │  │ 165.5 hrs│  │  7.5 hrs │  │    3     │  │   127    │     │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │  │
│  │                                                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Calendar View                                                │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                               │  │
│  │   Sun    Mon    Tue    Wed    Thu    Fri    Sat              │  │
│  │  ─────  ─────  ─────  ─────  ─────  ─────  ─────             │  │
│  │          1      2      3      4      5      6                │  │
│  │         6.5h   8.0h   7.5h   9.0h   6.0h   3.0h              │  │
│  │                                                               │  │
│  │   7      8      9     10     11     12     13                │  │
│  │  0.0h   7.0h   8.5h   7.0h   8.0h   7.5h   2.5h              │  │
│  │                                                               │  │
│  │  14     15     16     17     18     19     20                │  │
│  │  0.0h   6.5h   9.0h   4.5h   8.0h   6.5h   3.0h              │  │
│  │                                                               │  │
│  │  21     22     23     24     25     26     27                │  │
│  │  0.0h   7.5h   8.0h   7.0h   8.5h   7.0h   2.0h              │  │
│  │                                                               │  │
│  │  28     29     30                                             │  │
│  │  0.0h   6.0h   7.5h                                           │  │
│  │                                                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌────────────────────────┐  ┌────────────────────────────────┐   │
│  │  Top Projects          │  │  Category Breakdown            │   │
│  ├────────────────────────┤  ├────────────────────────────────┤   │
│  │                        │  │                                │   │
│  │  1. ATK        95.5 h  │  │  ┌──────────────────────────┐ │   │
│  │  2. PL Website 52.0 h  │  │  │    Development 78%       │ │   │
│  │  3. Internal   18.0 h  │  │  │    ████████████████████  │ │   │
│  │                        │  │  │    Meetings 12%          │ │   │
│  │  [View Details]        │  │  │    ████                  │ │   │
│  │                        │  │  │    Admin 7%              │ │   │
│  │                        │  │  │    ███                   │ │   │
│  │                        │  │  │    Research 3%           │ │   │
│  │                        │  │  │    █                     │ │   │
│  │                        │  │  └──────────────────────────┘ │   │
│  └────────────────────────┘  └────────────────────────────────┘   │
│                                                                      │
│  [Export Monthly Report PDF]  [◄ Previous Month]  [Next Month ►]   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## 5. Project Breakdown View

```
┌─────────────────────────────────────────────────────────────────────┐
│ PERFORMANT LABS                                    [User Menu ▼]    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Project Breakdown                            [← Back to Dashboard] │
│  ══════════════════                                                  │
│                                                                      │
│  Date Range: [Last 30 Days ▼]                                       │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Projects Summary                                             │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                               │  │
│  │  Project       │ Total Hours │ Entries │ Avg/Entry │ %      │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  ATK           │    95.5     │   45    │   2.1     │  58%   │  │
│  │  PL Website    │    52.0     │   38    │   1.4     │  31%   │  │
│  │  Internal      │    18.0     │   12    │   1.5     │  11%   │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  TOTAL         │   165.5     │   95    │   1.7     │ 100%   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  ATK Project Details                          [Expand All ▼] │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                               │  │
│  │  Total Hours: 95.5                                            │  │
│  │                                                               │  │
│  │  By Category:                                                 │  │
│  │    Development:  82.0 hrs (86%)  ████████████████████████    │  │
│  │    Meetings:      8.5 hrs  (9%)  ███                          │  │
│  │    Admin:         3.0 hrs  (3%)  █                            │  │
│  │    Research:      2.0 hrs  (2%)  █                            │  │
│  │                                                               │  │
│  │  Timeline (Last 30 Days):                                     │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │ 10│                                                     │  │  │
│  │  │  9│  █     █                                            │  │  │
│  │  │  8│  █     █  █        █                                │  │  │
│  │  │  7│  █  █  █  █     █  █                                │  │  │
│  │  │  6│  █  █  █  █  █  █  █     █                          │  │  │
│  │  │  5│  █  █  █  █  █  █  █  █  █                          │  │  │
│  │  │  0└─────────────────────────────────────────────────    │  │  │
│  │  │    Week 1  Week 2  Week 3  Week 4                       │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │                                                               │  │
│  │  Recent Entries:                                              │  │
│  │    Apr 16 - ATK Release 2.1 (9.0 hrs, Development)           │  │
│  │    Apr 16 - ATK Release 2.1 (1.0 hrs, Development)           │  │
│  │    Apr 15 - Client meeting (1.5 hrs, Meeting)                │  │
│  │    [View All ATK Entries →]                                  │  │
│  │                                                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  PL Website Project Details                   [Expand All ▼] │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  [Collapsed - Click to expand]                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Internal Project Details                     [Expand All ▼] │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  [Collapsed - Click to expand]                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  [Export Project Report]                                             │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Design Notes

### Color Scheme Suggestions
- **Primary**: Blue (#0066CC) - Headers, links, primary actions
- **Success**: Green (#28A745) - Positive metrics, completed items
- **Warning**: Orange (#FD7E14) - Alerts, important notices
- **Neutral**: Gray (#6C757D) - Secondary text, borders
- **Background**: Light gray (#F8F9FA) - Page background
- **Cards**: White (#FFFFFF) - Content containers

### Responsive Behavior
- **Desktop (>1200px)**: Full layout as shown
- **Tablet (768-1199px)**: Stack side-by-side elements vertically
- **Mobile (<768px)**:
  - Collapse filters into expandable sections
  - Show simplified table (fewer columns)
  - Stack all dashboard widgets vertically
  - Use hamburger menu for navigation

### Filter Behavior (Hybrid Approach)
- **Dashboard (Screen 1)**: Global filters apply to ALL statistics below
  - Filter indicator bar shows current filter state (e.g., "Showing: ATK Project, April 2026")
  - "Clear All Filters" button resets to default view
  - Use case: Quick ad-hoc analysis ("How many hours did I spend on ATK this month?")
- **Weekly/Monthly/Project Views (Screens 3-5)**: Dedicated filters for deep-dive analysis
  - Each view has its own specialized filtering
  - More detailed options and visualizations
- **Visual Clarity**: Active filters always visible with clear indicator

### Interactive Elements
- **Sortable columns**: Click column headers to sort
- **Filterable data**: Real-time filtering on all list views
- **Expandable sections**: Click to expand/collapse project details
- **Tooltips**: Hover over metrics for detailed breakdowns
- **Export options**: CSV, PDF, Excel formats
- **Date pickers**: Calendar widgets for date selection

### Accessibility
- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Focus indicators on all interactive elements
