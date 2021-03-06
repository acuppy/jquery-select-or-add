(function(){

  var SelectOrAdd = {

    options: {
      addOptionName:  'add_option',
      addOptionValue: 'add_option',
      addOptionPrompt: 'Enter a new item option name:',
      addOptionSeparator: true,
      autoSelectAddedOption: true, 
      disableSelectOnAddOption: true,
      allowDuplicates: false,
      onDuplicateFound: $.noop,
      onAddNewOption: $.noop
    },

    selectObject: null,
    
    init: function(select){
      this.selectObject = $(select);
      addOptionToSelect();
      addBindings();
    },

    addOptionToSelect: function(){
      var addOption = $('<option />').attr('name', this.options.addOptionName).val(this.options.addOptionValue);

      if( this.options.addOptionSeparator === true ){
        var addOptionSeparator = $('<option />').val('------').prop('disabled', true);     
        this.selectObject.append(addOptionSeparator);
      }

      this.selectObject.append(addOption);
    }

    addBindings: function(){
      var $this = this;

      this.selectObject.change(function(){
        $this.runner();
      });
    },

    enableSelect: function(){
      this.selectObject.prop('disabled', false);
    },

    disableSelect: function(){
      this.selectObject.prop("disabled", true);
    },

    getDuplicateOption: function(addOptionValue){
      return $.grep( $("option", this.selectObject ), function( elm, i){
        return ($(elm).html().toLowerCase() == addOptionValue.toLowerCase()) ? true : false
      });
    },

    selectAddedOption: function(){
      $("option:selected", this.selectObject ).prop('selected', false);
      $.each(this.getDuplicateOption(), function(){
        $(this).prop('selected', true);
      });
    },

    selectOption: function(optionName){
      $("option:selected", this.selectObject ).prop('selected', false);
      $('option[name="' + optionName + '"]', this.selectObject ).prop('selected', true);
    },

    runner: function(){

      var options = this.options;
      var newOptionValue;

      if( this.selectObject.val() == this.options.addOptionValue ){

        if( newOptionValue = prompt(options.addOptionPrompt, "") ){
            
          if( option.disableSelectOnAddOption ) this.disableSelect();

          if( this.getDuplicateOption().length > 0 && options.allowDuplicates === false ) {

            this.enableSelect();
            if( options.autoSelectAddedOption === true ) this.selectAddedOption();
            if( $.isFunction(options.onDuplicateFound) ) options.onDuplicateFound.call(this);
          
          } else {

            if( $.isFunction(options.onAddNewOption) ) options.onAddNewOption();

            var addOption = $('<option />').attr('name', newOptionValue).val(newOptionValue);
            this.selectObject.append(addOption);

          };

        } else {
          this.selectOption(default_category);
        };
      };
    }
  }

  $.fn.selectOrAdd = function(options){

    $.extend(SelectOrAdd.options, options);

    return this.each(function(){
      
      if( $(this).is('select') ){
        SelectOrAdd.init(this);
      } else {
        $.error('SelectOrAdd plugin must be bound to a dropdown');
      }

    });
  };

})(jQuery);