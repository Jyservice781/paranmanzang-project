import { UserModel } from "@/app/model/user/user.model";
import api from "@/app/api/axios";
import requests from "@/app/api/requests";
import { setAccessToken, removeNickname, removeAuthorization, getAuthorization, getNickname } from "@/app/api/authUtils";
import { AppDispatch } from "@/lib/store";
import { getCurrentUser, saveCurrentUser, saveNickname } from "@/lib/features/users/user.slice";
import { userService } from "./user.service";
import { groupService } from "../group/group.service";
import { likeBookService } from "../group/likeBook.service";
import { likePostService } from "../group/likePost.service";
import { roomService } from "../room/room.service";
import { useSelector } from "react-redux";


const login = async (username: string, password: string, dispatch: AppDispatch): Promise<any> => {
  try {
    const response = await api.post<UserModel>(requests.fetchLogin,
      { username, password }
    )
    console.log("response 에러 확인", response)
    const token = response.headers['authorization'].replace("Bearer ", "")

    console.log("token 확인 ", token)
    if (token) {
      setAccessToken(token);
      dispatch(saveNickname(response.headers['nickname']))

      const nickname = response.headers['nickname']
      userService.findUserDetail(nickname, dispatch)
      groupService.findByNickname(nickname, dispatch)
      likeBookService.findByNickname(nickname, dispatch)
      roomService.findAllLikedByNickname(nickname, dispatch)
      likePostService.findAllByUserNickname(nickname, dispatch)

    } else {
      throw new Error('토큰을 받지 못했습니다.');
    }
  } catch (error: any) {
    if (error.response) {
      console.error('Server Error:', error.response.data);
      throw new Error('서버에서 오류가 발생했습니다.');
    } else if (error.request) {
      console.error('No Response:', error.request);
      throw new Error('서버 응답이 없습니다.');
    } else {
      console.error('Error:', error.message);
      throw new Error('비밀번호가 다릅니다 발생');
    }
  }
};

const get = async (): Promise<UserModel> => {
  try {
    const response = await api.get<any>("/get")
    console.log("GET: ", response)
    return response.data;

  } catch (error: any) {
    if (error.response) {
      console.error('Server Error:', error.response.data);
      throw new Error('서버에서 오류가 발생했습니다.');
    } else if (error.request) {
      console.error('No Response:', error.request);
      throw new Error('서버 응답이 없습니다.');
    } else {
      console.error('Error:', error.message);
      throw new Error('get 중 오류 발생');
    }
  }
}
const oauth = async (): Promise<any> => {
  const oauthUrl = process.env.NEXT_PUBLIC_OAUTH_URL

  if (!oauthUrl) {
    throw new Error('OAuth URL이 정의되지 않았습니다.')
  }

  // 첫 번째 단계: OAuth URL로 리디렉션
  console.log("Redirecting to OAuth URL:", oauthUrl)
  window.location.href = oauthUrl
  console.log("loginService 부분", window.location.href)
}
const handleOAuthCallback = (dispatch: AppDispatch): void => {
  try {
    const authToken = getAuthorization()
    const nickname = getNickname()

    if (!authToken || !nickname) {
      console.error('🚨 에러 발생: 액세스 토큰이나 닉네임이 없습니다.')
      throw new Error('액세스 토큰이나 닉네임이 없습니다.')
    }

    // 현재 user 의 정보를 redux 에 저장
    GetToken(authToken, nickname, dispatch)
    saveCurrentUser; 
    // auth 로그인 이후 nickname, Authorization 없애기
    removeAuthorization()
    removeNickname()

    console.log('🔍 handleOAuthCallback 함수 종료')
  } catch (error) {
    console.error('OAuth 처리 중 오류:', error)
    throw error  // 상위에서 처리할 수 있도록 에러를 다시 throw
  }
}

const GetToken = async (token: string, nickname: string, dispatch: AppDispatch) => {
  setAccessToken(token);
  dispatch(saveNickname(nickname));
  await userService.findUserDetail(nickname, dispatch);
  const user = useSelector(getCurrentUser)

  // 사용자 정보를 가져오기 위한 요청을 Promise.all로 처리
  if (user?.role === 'ROLE_USER') {
    await Promise.all([
      groupService.findByNickname(nickname, dispatch),
      likeBookService.findByNickname(nickname, dispatch),
      roomService.findAllLikedByNickname(nickname, dispatch),
      likePostService.findAllByUserNickname(nickname, dispatch)
    ]);
  }

  removeNickname(); // 함수 호출
  removeAuthorization(); // 함수 호출
};
export const loginService = {
  login,
  get,
  oauth,
  handleOAuthCallback
}