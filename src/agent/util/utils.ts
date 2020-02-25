export const disposeEvent = (event: any) => {
    event.stopPropagation(); //Прекращает дальнейшую передачу текущего события
    event.preventDefault(); //запрещает исполнение метода по умолчанию, предназначенного для данного события
}