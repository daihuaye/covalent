import { Component, HostBinding, ViewChild, ViewRef, AfterViewInit } from '@angular/core';
import { AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';
import { slideInDownAnimation } from '../../../app.animations';

// TODO: uncomment before publishing
// import { TdDynamicType, ITdDynamicElementConfig, TdDynamicElement } from '@covalent/dynamic-forms';

// TODO: remove before publishing
// fun `yarn build` to build covalent in `deploy` directory
import { TdDynamicType, ITdDynamicElementConfig,
  TdDynamicElement, ITdCustomValidate, ITdCustomError, TdDynamicFormsComponent } from '../../../../platform/dynamic-forms';

@Component({
  selector: 'dynamic-forms-demo',
  styleUrls: ['./dynamic-forms.component.scss'],
  templateUrl: './dynamic-forms.component.html',
  animations: [slideInDownAnimation],
})
export class DynamicFormsDemoComponent implements AfterViewInit {

  @HostBinding('@routeAnimation') routeAnimation: boolean = true;
  @HostBinding('class.td-route-animation') classAnimation: boolean = true;

  @ViewChild('customValidateForm') customValidateForm: TdDynamicFormsComponent;

  dynamicFormsAttrs: any[] = [{
    description: `JS Object that will render the elements depending on its config.
                  [name] property is required.`,
    name: 'elements',
    type: 'ITdDynamicElementConfig[]',
  }, {
    description: `Getter property for dynamic [FormGroup].`,
    name: 'form',
    type: 'get(): FormGroup',
  }, {
    description: `Getter property for [valid] of dynamic [FormGroup].`,
    name: 'valid',
    type: 'get(): boolean',
  }, {
    description: `Getter property for [value] of dynamic [FormGroup].`,
    name: 'value',
    type: 'get(): any',
  }, {
    description: `Getter property for [errors] of dynamic [FormGroup].`,
    name: 'errors',
    type: 'get(): {[name: string]: any}',
  }, {
    description: `Getter property for [controls] of dynamic [FormGroup].`,
    name: 'controls',
    type: 'get(): {[key: string]: AbstractControl}',
  }];

  textElements: ITdDynamicElementConfig[] = [{
    name: 'input',
    type: TdDynamicElement.Input,
    required: false,
  }, {
    name: 'required-input',
    label: 'Input Label',
    type: TdDynamicElement.Input,
    required: true,
  }, {
    name: 'textarea',
    type: TdDynamicElement.Textarea,
    required: false,
  }, {
    name: 'text',
    type: TdDynamicType.Text,
    required: false,
    default: 'Default',
  }, {
    name: 'required-password',
    label: 'Password Label',
    type: TdDynamicElement.Password,
    required: true,
  }];

  numberElements: ITdDynamicElementConfig[] = [{
    name: 'number',
    label: 'Number',
    type: TdDynamicType.Number,
    required: true,
    min: 18,
    max: 70,
  }, {
    name: 'slider',
    type: TdDynamicElement.Slider,
    min: 18,
    max: 70,
  }];

  booleanElements: ITdDynamicElementConfig[] = [{
    name: 'boolean',
    label: 'Boolean Label',
    type: TdDynamicType.Boolean,
    default: false,
  }, {
    name: 'slide-toggle',
    type: TdDynamicElement.SlideToggle,
    default: true,
  }, {
    name: 'checkbox',
    type: TdDynamicElement.Checkbox,
  }];

  arrayElements: ITdDynamicElementConfig[] = [{
    name: 'array',
    type: TdDynamicType.Array,
    selections: ['Test1', 'Test2', 'Test3', 'Test4'],
    default: 'Test1',
  }, {
    name: 'required-select',
    type: TdDynamicElement.Select,
    selections: ['Test1', 'Test2', 'Test3', 'Test4'],
    required: true,
  }];

  // Custom Validator using ITdCustomValidate object
  customValidationITdCustomValidate: ITdDynamicElementConfig[] = [{
    name: 'numberIsEven',
    label: 'Even Number In Rage',
    type: TdDynamicType.Number,
    customValidators: [

      // Simple Validation using ITdCustomValidate interface
      <ITdCustomValidate>{

        // Must be unique
        name: 'isEven',

        // Static error message presented in UI
        message: 'Must be even',

        // Return true if valid
        predicateFn: (value: any): boolean => {
          return ( value % 2 ) === 0;
        },
      },
    ],
  }];

  // Custom Validator using ValidatorFn function
  customValidationValidatorFn: ITdDynamicElementConfig[] = [{
    name: 'numberIsOddInRange',
    label: 'Odd Number In Range',
    type: TdDynamicType.Number,
    min: 8,
    max: 20,
    customValidators: [

      // Function using ValidatorFn signature
      <ValidatorFn>(control: AbstractControl): { [key: string]: any } => {

        // Validate Logic
        let isOdd: boolean = ( control.value % 2 ) !== 0;

        // ITdCustomError Object
        let error: ITdCustomError = {

          // Must be unique
          'isOdd': {

            // Dynamic error message presented to UI
            message: 'Not Odd: ' + control.value, 
          },
        };

        return !isOdd ? error : undefined;
      },
    ],
  }];

  // Custom validator with different methods
  multipleValidatorTypes: ITdDynamicElementConfig[] = [{
    name: 'containValidCharacters',
    label: 'Password',
    type: TdDynamicElement.Password,
    required: true,

    // Covalent validator migrated from other project
    tdContainsUppercaseCharacter: true,
    
    customValidators: [

      // Contain at lease one number
      <ITdCustomValidate>{
        name: 'containsNumber',
        message: 'Need a number',
        predicateFn: (value: any): boolean => {
          return /\d/i.test(value); // Return true if valid
        },
      },

      // Length between 8 - 20 characters
      <ITdCustomValidate>{
        name: 'length',
        message: 'Password needs from 8 - 20 characters',
        predicateFn: (value: any): boolean => {
          return value && ( value.length >= 8 ) && ( value.length <= 20 ); // Return true if valid
        },
      },

      // Contain at least one special character
      <ValidatorFn>(control: AbstractControl): { [key: string]: any } => {

        let validCharacters: string[] = ['!', '@', '#', '$', '%'];
        let regex: RegExp = new RegExp('[' + validCharacters.join('').toString() + ']', 'g');
        
        let isValid: boolean = regex.test(control.value);

        let error: ITdCustomError = {
          'containSpecialCharacters': {

            // TODO: parenthesis may be mistaken for valid special character. refine error message.
            message: 'Need at least one special character (' + validCharacters.join(', ').toString() + ')',
          },
        };

        return !isValid ? error : undefined;
      },
    ],
  }];

  // TODO: remove before publish - for dev only
  ngAfterViewInit(): void {
  //   (<FormGroup>this.customValidateForm.dynamicForm).valueChanges.subscribe(() => {
  //     console.log(this.customValidateForm.errors);
  //   });
  }
}
