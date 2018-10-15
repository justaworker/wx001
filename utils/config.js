const basePath = 'https://wxapi.joinmap.ai/api';
const urlList = {
  loginUrl: basePath + '/user/thirdPart/login/xcx',// 登录
  uploadUrl: basePath + '/view/project/upload',// 上传 
  userUrl: basePath + '/user/self',// userInfo
  register: basePath + '/user/thirdPart/register',// 注册
   
  checkUserUrl: basePath + '/user/checkUserName'// checkuser 
    
}
module.exports = urlList;
