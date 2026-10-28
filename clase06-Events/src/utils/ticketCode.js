export const generateTicketCode = () => {

    const randomPart = Math.random()
    .toString(36)
    .substring(2, 15);

    return `TCK-${randomPart}`;
}