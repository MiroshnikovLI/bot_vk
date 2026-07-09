function createMenuDescription(mass) {
    const message = [`${mass.NAME.toUpperCase()}\n`];
    Object.values(mass).forEach(e => {
      if (e.TEXT) {
        message.push(`${e.ICON ? e.ICON : '' } ${e.TEXT.toUpperCase()} - ${e.DESCRIPTION},`)
      }
    });
    return message.join('\n');
}

module.exports = {
  createMenuDescription
}