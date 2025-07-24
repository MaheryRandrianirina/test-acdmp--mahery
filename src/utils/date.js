function parseDDMMYYYY(dateStr) {
  const [day, month, year] = dateStr.split("/")
  return new Date(`${year}-${month}-${day}`)
}

module.exports = parseDDMMYYYY