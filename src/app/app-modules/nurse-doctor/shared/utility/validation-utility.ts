export class ValidationUtils {

  validateDuration(duration, durationUnit, beneficiaryAge: any) {

    let totalDays = 0;
    let beneficiaryAgeInDays = 0;

    switch (durationUnit) {
      case "Hours": totalDays = duration / 24; break;
      case "Days": totalDays = duration; break;
      case "Weeks": totalDays = duration * 7; break;
      case "Months": totalDays = duration * 30; break;
      case "Years": totalDays = duration * 365; break;
    }

    let temp = beneficiaryAge.split(" - ");

    for (let i = 0; i < temp.length; i++) {
      beneficiaryAgeInDays = beneficiaryAgeInDays + this.getAgeValue(temp[i]);
    }

    if ((beneficiaryAgeInDays) >= (totalDays))
      return true;
    else
      return false;
  }


  getAgeValue(age) {
    if (!age)
      return 0;

    let arr = (age !== undefined && age !== null ) ? age.trim().split(' ') : age;
    let ageUnit = arr[1];
    if (ageUnit.toLowerCase() == "years")
      return parseInt(arr[0]) * 365;
    else if (ageUnit.toLowerCase() == 'months')
      return parseInt(arr[0]) * 30;
    else if (ageUnit.toLowerCase() == 'weeks')
      return parseInt(arr[0]) * 7;
    else if (ageUnit.toLowerCase() == 'days')
      return parseInt(arr[0]);
    else
      return 0;
  }
}