/**
 * @file
 */

(function ($, Drupal, once) {
  'use strict';
  Drupal.behaviors.smsPhoneNumberFormElement = {
    attach: function (context, settings) {
      once('field-setup', '.sms-phone-number-field .local-number', context).forEach(function (value) {
        var $input = $(value);
        var val = $input.val();
        $input.keyup(function (e) {
          if (val !== $(this).val()) {
            val = $(this).val();
            $input.parents('.sms-phone-number-field').find('.send-button').addClass('show');
            $input.parents('.sms-phone-number-field').find('.verified').addClass('hide');
          }
        });
      });

      once('field-setup', '.sms-phone-number-field .country', context).forEach(function (value) {
        var val = $(value).val();
        $(value).change(function (e) {
          if (val !== $(this).val()) {
            val = $(this).val();
            $input.parents('.sms-phone-number-field').find('.send-button').addClass('show');
            $input.parents('.sms-phone-number-field').find('.verified').addClass('hide');
          }
        });
      });
      once('field-setup', '.sms-phone-number-field .send-button', context).click(function (value) {
        var $button = $(value);
        $button.parent().find('[type="hidden"]').val('');
      });

      if (settings['smsPhoneNumberVerificationPrompt']) {
        $('#' + settings['smsPhoneNumberVerificationPrompt'] + ' .verification').addClass('show');
        $('#' + settings['smsPhoneNumberVerificationPrompt'] + ' .verification input[type="text"]').val('');
      }

      if (settings['smsPhoneNumberHideVerificationPrompt']) {
        $('#' + settings['smsPhoneNumberHideVerificationPrompt'] + ' .verification').removeClass('show');
      }

      if (settings['smsPhoneNumberVerified']) {
        $('#' + settings['smsPhoneNumberVerified'] + ' .send-button').removeClass('show');
        $('#' + settings['smsPhoneNumberVerified'] + ' .verified').addClass('show');
      }
    }
  };
})(jQuery, Drupal, once);
