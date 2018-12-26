export function getMatchsDuJour() {
    fetch('http://192.168.1.81:3000/api/matchdujour?championnat=La Liga')
    .then((response) => response.json())
    .catch((error) => console.error(error))
} 