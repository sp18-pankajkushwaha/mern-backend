
const promiseResolve = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Promise is Succesfully resolved.')
    }, 1000)
    
})

console.log(promiseResolve)

promiseResolve.then(result => console.log(result))


const promiseReject = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject('Promise rejected due to error')
    }, 1000)
})
promiseReject.catch(err => console.log(err))
    .finally(() => {
        console.log('Promise fulfilled (either resolved or rejected)')
    })



const p1=Promise.resolve(1)
const p2=Promise.resolve(2)
const p3=Promise.resolve(3)

Promise.all([p1,p2,p3]).then(values=>console.log('All promises are resolved ', values))
                       .catch(err=>console.log('One promise failed ',err))



const p4=Promise.resolve('Success')
const p5=Promise.reject('Failed')

Promise.allSettled([p4,p5]).then(res=>console.log('All Settled ',res))


const p6=Promise.reject('Error1')
const p7=Promise.resolve('Success2')
const p8=Promise.reject('Error3')

Promise.any([p6,p7,p8]).then(res=>console.log('First Resolved Promise ',res))
                       .catch(err=>console.log('All Promises failed',err))



const fast= new Promise(resolve=>setTimeout(()=>{
    resolve('Fast!')
},500))

const slow=new Promise(resolve=>setTimeout(()=>{
    resolve('Slow!')
},1000))

Promise.race([fast,slow]).then(res=>console.log('First one to settle ',res))


//async await
function fetchDataFromServer() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Server data received!');
            //reject('failed to retrieve data')
        }, 3000);
    });
}

async function getData() {
    try {
        console.log('Fetching data...');
        const data = await fetchDataFromServer(); 
        console.log('Result:', data); 
    } catch (error) {
        console.error('Error:', error);
    }
}
getData();
