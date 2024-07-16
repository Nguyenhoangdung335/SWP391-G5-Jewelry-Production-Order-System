const arrayToDate = (dateArray) => {
    const dateObject = new Date(
        dateArray[0],
        dateArray[1] - 1,
        dateArray[2],
        dateArray[3],
        dateArray[4],
        dateArray[5]
    );
    return dateObject.toLocaleString(); // Format the date as needed
};

export default arrayToDate;