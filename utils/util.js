const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const distanceCheck = (lng_a, lat_a, lng_b, lat_b) => {
  var pk = 180 / 3.14169;
  var a1 = lat_a / pk;
  var a2 = lng_a / pk;
  var b1 = lat_b / pk;
  var b2 = lng_b / pk;
  var t1 = Math.cos(a1) * Math.cos(a2) * Math.cos(b1) * Math.cos(b2);
  var t2 = Math.cos(a1) * Math.sin(a2) * Math.cos(b1) * Math.sin(b2);
  var t3 = Math.sin(a1) * Math.sin(b1);
  var tt = Math.acos(t1 + t2 + t3);
  return Math.floor(6366000 * tt);
}
module.exports = {
  formatTime: formatTime,
  distanceCheck: distanceCheck
}
