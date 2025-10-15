export const months = [
   "January",
   "February",
   "March", 
   "April",
   "May",
   "June",
   "July",
   "August",
   "September",
   "October",
   "November",
   "December"
];

export const getMonth = (month: string) => {
   return months[parseInt(month) - 1];
}