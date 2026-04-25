(function ($) {
    $(document).ready(function () {
        AOS.init();

        var btn = $('.show-intro-video');
        var videoContainer = $('#videoContainer');
        var body = $('body');

        if (btn.length && videoContainer.length) {
            var iframe = $('#videoContainer iframe');
            var player = new Vimeo.Player(iframe);

            btn.on('click', function () {
                videoContainer.toggleClass('collapse');
                if (!videoContainer.hasClass('collapse')) {
                    player.play();
                }else{
                    player.pause();
                    player.setCurrentTime(0);
                }
            });

            body.on('click', function (e) {
                if (!videoContainer.is(e.target) && !btn.is(e.target) && videoContainer.has(e.target).length === 0 && btn.has(e.target).length === 0) {
                    videoContainer.addClass('collapse');
                    player.pause();
                    player.setCurrentTime(0);
                }
            });
        }
    });
})(jQuery);
