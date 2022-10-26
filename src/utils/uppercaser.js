export default function upperCaser(str) {
  const upperCaserReg = /([^a-z]|^)([a-z])(?=[a-z]{2})/g
  return str.replace(upperCaserReg, (_, g1, g2) => g1 + g2.toUpperCase() );
}