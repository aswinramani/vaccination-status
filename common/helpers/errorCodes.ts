const ErrorCodes = {
    'BadRequest': {
        'code': 400,
        'messages': {
            'missing': 'missing query parameters!',
            'case1': 'start year cannot be greater than end year',
            'case2': 'start year cannot be lesser than minYear',
            'case3': 'start year cannot be greater than currentYear',
            'case4': 'week cannot be greater than 53',
            'case5': 'start week cannot be greater than current week for this year'
        }
    }
    
}
export default ErrorCodes;
