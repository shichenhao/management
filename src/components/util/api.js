
window.addToken=function(obj){
    var newObj=obj || {}
    newObj.token=sessionStorage.getItem("token")
    return newObj
}

import axios from 'axios';

const instance = axios.create({})

instance.defaults.transformRequest = [function (data) {
    let newData = ''
    for (let k in data) {
        newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
    }
    return newData
}]
instance.interceptors.request.use(function (config) {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    return config
})

export {
    instance
}
