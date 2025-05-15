(function ($) {
    $(document).ready(function () {
        AOS.init();

        var btn = $('.show-intro-video');
        var video = $('#videoContainer');
        var body = $('body'); // For detecting clicks outside the video

        if (btn.length && video.length) {
            // Toggle video visibility on button click
            btn.on('click', function () {
                video.toggleClass('collapse');
            });

            // Close the video if clicked outside the video container
            body.on('click', function (e) {
                // If the click is outside the video container and the button
                if (!video.is(e.target) && !btn.is(e.target) && video.has(e.target).length === 0 && btn.has(e.target).length === 0) {
                    video.addClass('collapse'); // Collapse the video
                }
            });
        }
    });
})(jQuery);
