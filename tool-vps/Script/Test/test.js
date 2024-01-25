function simplePromiseFunction(number) {
  return new Promise((resolve, reject) => {
    // Kiểm tra điều kiện
    if (number % 2 === 0) {
      // Nếu số là chẵn, giải quyết Promise với số đó
      resolve();
    } else {
      // Nếu số là lẻ, từ chối Promise với thông báo lỗi
      reject();
    }
  });
}
const start = async (i) => {
  try {
    await simplePromiseFunction(i);
    return i;
  }
  catch (e){
    return i + "xyz";
  }
}
let i = 0;
while (i < 10) {
  start(i).then((indexProfile) => {
    console.log('ok', indexProfile);
  }).catch((indexProfile) => {
    console.log('error', indexProfile);
  });
  i++;
}