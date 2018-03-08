import {requestUrl} from '../Network/url';//接口url

export default function(){
    fetch(requestUrl.baseInfo)
        .then((response) => response.json())
        .then((responseData)=>{
            return responseData;
        })
        .catch(
            (error)=>{console.log('error',error);
            });

}