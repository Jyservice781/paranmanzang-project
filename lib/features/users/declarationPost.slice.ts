import { initialUserState, DeclarationPostModel } from '@/models/user/users.model';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export const declarationPostSlice = createSlice({
    name: 'declarationPost',
    initialState: initialUserState,
    reducers: {
        saveDeclarationPosts: (state, action: PayloadAction<DeclarationPostModel[]>) => {
            state.declarationPosts = action.payload;
        },
        saveDeclarationPostsByNickname: (state, action: PayloadAction<DeclarationPostModel[]>) => {
            state.declarationPostsByNickname = action.payload;
        },
        saveCurrentDeclarationPost: (state, action: PayloadAction<DeclarationPostModel>) => {
            state.currentDeclarationPost = action.payload;
        },
        addDeclarationPost: (state, action: PayloadAction<DeclarationPostModel>) => {
            state.declarationPosts.push(action.payload);
        },
        addDeclarationPostByNickname: (state, action: PayloadAction<DeclarationPostModel>) => {
            state.declarationPostsByNickname.push(action.payload);
        },
        deleteDeclarationPost: (state, action: PayloadAction<number>) => {
            state.declarationPosts = state.declarationPosts.filter(declarationPost => declarationPost.id !== action.payload);
        },
        deleteDeclarationPostByNickname: (state, action: PayloadAction<number>) => {
            state.declarationPostsByNickname = state.declarationPosts.filter(declarationPost => declarationPost.id !== action.payload);
        },
        saveTotalPageDeclarationPostByAdimin: (state, action: PayloadAction<number>) => {
            state.totalPageDeclarationPostByAdimin = action.payload;
        },
        saveTotalPageDeclarationPost: (state, action: PayloadAction<number>) => {
            state.totalPageDeclarationPost = action.payload;
        },
    }
});

// 셀렉터 정의
export const getDeclarationPosts = (state: RootState) => state.declarationPost.declarationPosts;
export const getDeclarationPostsByNickname = (state: RootState) => state.declarationPost.declarationPostsByNickname;
export const getCurrentDeclarationPost = (state: RootState) => state.declarationPost.currentDeclarationPost;
export const getTotalPageDeclarationPostByAdimin = (state: RootState) => state.declarationPost.totalPageDeclarationPostByAdimin;
export const getTotalPageDeclarationPost = (state: RootState) => state.declarationPost.totalPageDeclarationPost;

export const {
    saveDeclarationPosts,
    saveDeclarationPostsByNickname,
    saveCurrentDeclarationPost,
    addDeclarationPost,
    addDeclarationPostByNickname,
    deleteDeclarationPost,
    deleteDeclarationPostByNickname,
    saveTotalPageDeclarationPostByAdimin,
    saveTotalPageDeclarationPost,
} = declarationPostSlice.actions;

export default declarationPostSlice.reducer;