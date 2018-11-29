const getDate = dateObj => {
  if (dateObj instanceof Date)
    return (
      dateObj.getFullYear() +
      '-' +
      get2digits(dateObj.getMonth() + 1) +
      '-' +
      get2digits(dateObj.getDate())
    );
};

const get2digits = num => {
  return ('0' + num).slice(-2);
};

const getDate2 = dateObj => {
  if (dateObj instanceof Date)
    return (
      dateObj.getFullYear() +
      '-' +
      get2digits(dateObj.getMonth() + 1) +
      '-' +
      get2digits(dateObj.getDate()) +
      ' ' +
      get2digits(dateObj.getHours()) +
      ':' +
      get2digits(dateObj.getMinutes())
    );
};



module.exports = {
  getDate,
  getDate2,
};
