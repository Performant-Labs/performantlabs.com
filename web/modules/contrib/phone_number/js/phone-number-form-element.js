/**
 * @file
 * Provides widget behaviours.
 */

(($, Drupal, once) => {
  /**
   * Handles the phone number element.
   *
   * @type {{attach: Drupal.behaviors.phoneNumberFormElement.attach}}
   */
  Drupal.behaviors.phoneNumberFormElement = {
    attach(context) {
      once('field-setup', '.phone-number-field .country', context).forEach(
        (value) => {
          const $input = $(value);
          let val = $input.val();
          $input.data('value', val);
          $input
            .wrap('<div class="country-select"></div>')
            .before(
              '<div class="phone-number-flag"></div><span class="arrow"></span><div class="prefix"></div>',
            );

          function setCountry(country) {
            $input
              .parents('.country-select')
              .find('.phone-number-flag')
              .removeClass($input.data('value'));
            $input
              .parents('.country-select')
              .find('.phone-number-flag')
              .addClass(country.toLowerCase());
            $input.data('value', country.toLowerCase());

            const { options } = $input.get(0);
            for (let i = 0; i < options.length; i++) {
              if (options[i].value === country) {
                const prefix = options[i].label.match(/(\d+)/)[0];
                $input
                  .parents('.country-select')
                  .find('.prefix')
                  .text(`(+${prefix})`);
              }
            }
          }

          setCountry(val);

          $input.change( function() {
            if (val !== $(this).val()) {
              val = $(this).val();
            }

            setCountry(val);
          });
        },
      );
    },
  };
})(jQuery, Drupal, once);
