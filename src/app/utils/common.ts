export function msToTime(duration) {
  let minutes: any = Math.floor(duration / 60000);
  let seconds: any = ((duration % 60000) / 1000).toFixed(0);
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  return minutes + ':' + seconds;
}
