"use client";
import { FileType } from '@/models/file/file.model';
import { GroupPostModel } from '@/models/group/group.model';
import { fileService } from '@/services/file/file-service';
import { groupPostService } from '@/services/group/groupPost-service';
import { getCurrentGroup, saveCurrentGroupPost } from '@/lib/features/group/group.slice';
import { getNickname } from '@/lib/features/users/user.slice';
import { useAppDispatch } from '@/lib/store';
import { useRouter } from 'next/navigation';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useSelector } from 'react-redux';

export default function PostEditor() {
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null); // 단일 파일
  const [selectedGroup, setSelectedGroup] = useState<string>('General');

  const group = useSelector(getCurrentGroup);
  const nickname = useSelector(getNickname);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // 이미지 올리기
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file); // 첫 번째 파일 저장
    }
  };


  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    if (!group?.id || !nickname) {
      alert('그룹 정보가 없습니다.');
      return;
    }

    const groupPost: GroupPostModel = {
      title,
      content,
      userGroupId: group.id,
      postCategory: selectedGroup,
      nickname: nickname
    };

    const response = await groupPostService.insert(groupPost, dispatch);

    if (imageFile && response?.id) {
      fileService.uploadFile(imageFile, FileType.GROUP_POST, response.id, dispatch);
    }
    dispatch(saveCurrentGroupPost(response))
    router.push(`/groups/board/detail/${response.id}`);
  };
  return (
    <div className="mx-auto max-w-2xl space-y-6 rounded-lg bg-white p-6 shadow-md">
      {/* Group/Board Selection */}
      <div>
        <label htmlFor="groupSelect" className="mb-2 block text-sm font-medium text-gray-700">
          카테고리
        </label>
        <select
          id="groupSelect"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
        >
          {group?.nickname === nickname && <option value="Notice">공지 사항</option>}
          <option value="General">자유게시판</option>
        </select>
      </div>

      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700">
          글 제목
        </label>
        <input
          id="title"
          value={title}
          onChange={handleTitleChange}
          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 shadow-md transition-all duration-300 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-300 sm:text-base"
          placeholder="제목을 입력해주세요."
        />
      </div>

      <div>
        <label htmlFor="content" className="mb-2 block text-sm font-medium text-gray-700">
          글 내용
        </label>
        <textarea
          id="content"
          value={content}
          onChange={handleContentChange}
          rows={6}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          placeholder="내용을 입력해주세요."
        />
      </div>

      <div>
        <label htmlFor="imageUpload" className="mb-2 block text-sm font-medium text-gray-700">
          이미지 업로드
        </label>
        <input
          type="file"
          id="imageUpload"
          onChange={handleImageUpload}
          accept="image/*"
          className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-gray-700 hover:file:bg-gray-200"
        />
        {imageFile && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">{imageFile.name}</p>
          </div>
        )}
      </div>

      <button
        onClick={onSubmit}
        className="w-full rounded-md bg-green-500 px-4 py-3 text-white shadow-md transition-colors duration-300 hover:bg-green-600"
      >
        글 작성
      </button>
    </div>
  );
};