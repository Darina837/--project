module.exports.validateRegisterInput = (
    login,
    telephone,
    password,
    confirmPassword
) => {
    const errors = {};
    if(login.trim() === '') {
        errors.login = 'InvalidLogin';
    }

    if(password === '') {
        errors.password = 'InvalidPassword'
    } else if(password !== confirmPassword) {
        errors.confirmPassword = 'InvalidPassword';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}