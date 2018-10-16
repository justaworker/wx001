const basePath = 'https://wxapi.joinmap.ai/api';
const urlList = {
  login: basePath + '/user/thirdPart/login/xcx',// 小程序登录
  upload: basePath + '/view/project/upload',// 上传 
  register: basePath + '/user/thirdPart/register',// 小程序注册
  reglogin: basePath + '/user/thirdPart/reglogin',// 小程序注册登录    /user/login
  userLogin: basePath + '/user/login',// 用户名密码登录
}
module.exports = urlList;
