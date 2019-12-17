import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

export function emailValidator(control: FormControl): { [key: string]: any } {
    var emailRegexp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if (control.value && !emailRegexp.test(control.value)) {
        return { invalidEmail: true };
    }
}


export function matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
        const password = group.controls[passwordKey];
        const confirmPassword = group.controls[confirmPasswordKey];

        if (password.value !== confirmPassword.value) {
            return {
                mismatchedPasswords: true
            };
        }
    }
}

export function maxLengthbetween(passwordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
        const password = group.controls[passwordKey];
        if (password.value.length > 8 && password.value.length < 12) {
            return {
                maxLengthbetween: true
            };
        }
    }
}


