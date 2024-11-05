import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsLoading, getError, getUserGroups } from '@/lib/features/group/group.slice';
import GroupCard from './GroupCard';
import LoadingSpinner from '../status/LoadingSpinner';
import ErrorMessage from '../status/ErrorMessage';
import { groupService } from '@/app/service/group/group.service';
import { useAppDispatch } from '@/lib/store';
import Pagination from './pagination/Pagination';
import { getNickname } from '@/app/api/authUtils';

interface MyGroupRowProps {
    active: boolean;
    onSelect: () => void;
}

const MyGroupRow = ({ active, onSelect }: MyGroupRowProps) => {
    const dispatch = useAppDispatch();
    const groups = useSelector(getUserGroups);
    const loading = useSelector(getIsLoading);
    const error = useSelector(getError);


    const nickname = useSelector(getNickname)
    console.log("My group", groups)

    useEffect(() => {
        if (nickname) {
            groupService.findByNickname(nickname, dispatch)
        }
    }, [dispatch, nickname, active]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <>
            <div className="w-[92%] mb-4 ml-4 grid grid-cols-4 gap-6 md:grid-cols-3">
                {groups.map((group, index) => (
                    <GroupCard key={index} group={group} active={active} onSelect={onSelect} />
                ))}
            </div>
        </>
    );
};

export default MyGroupRow;