"use client";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { FaHeart, FaExclamationCircle, FaUserFriends, FaUserEdit, FaArrowLeft, FaBuilding } from 'react-icons/fa';
import LoadingSpinner from '@/components/common/status/LoadingSpinner';
import ErrorMessage from '@/components/common/status/ErrorMessage';
import { getCurrentUser } from '@/lib/features/users/user.slice';
import { RootState } from '@/lib/store';
import { getLeaderGroups } from '@/lib/features/group/group.slice';
import styles from './UserProfile.module.css';
import { MdCalendarToday } from 'react-icons/md';
interface ActionButtonProps {
    onClick: () => void;
    icon: JSX.Element;
    label: string;
    className?: string;
}

const ActionButton = ({ onClick, icon, label, className = '' }: ActionButtonProps) => (
    <button onClick={onClick} className={`${styles['action-button']} ${className}`}>
        {icon}
        <span>{label}</span>
    </button>
);

export default function UserProfile() {
    const router = useRouter();
    const user = useSelector(getCurrentUser);
    const leaderGroup = useSelector(getLeaderGroups);
    const { isLoading, error } = useSelector((state: RootState) => state.user);

    const profileImageSrc = `${process.env.NEXT_PUBLIC_IMAGE_DEFAULT}`;

    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className={styles['profile-container']}>
            {/* 프로필 정보 */}
            <div className={styles['profile-info']}>
                <Image
                    className={styles['profile-image']}
                    width={120}
                    height={120}
                    src={profileImageSrc}
                    alt="프로필 사진"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = profileImageSrc;
                    }}
                />
                <ul className={styles['profile-details']}>
                    <li>
                        <strong>닉네임:</strong> {user?.nickname}
                    </li>
                    <li>
                        <strong>아이디:</strong> {user?.username}
                    </li>
                </ul>
            </div>

            {/* 버튼 목록 */}
            <div className={styles['button-group']}>
                {leaderGroup.length > 0 && (
                    <>
                        <ActionButton
                            onClick={() => router.push('/booking')}
                            icon={<MdCalendarToday />}
                            label="소모임 스케쥴 관리"
                        />
                    </>
                )}

                {user?.role === 'ROLE_SELLER' && (
                    <ActionButton
                        onClick={() => router.push('/seller/rooms')}
                        icon={<FaBuilding />}
                        label="등록 공간"
                    />
                )}

                {user?.role === 'ROLE_USER' && (
                    <>
                        <ActionButton
                            onClick={() => router.push('/likeList')}
                            icon={<FaHeart />}
                            label="찜목록"
                        />
                        <ActionButton
                            onClick={() => router.push('/users/declarationList')}
                            icon={<FaExclamationCircle />}
                            label="내가 신고한 내역"
                        />
                        <ActionButton
                            onClick={() => router.push('/users/friends')}
                            icon={<FaUserFriends />}
                            label="친구 목록"
                        />
                        <ActionButton
                            onClick={() => router.push('/groups/add')}
                            icon={<FaUserFriends />}
                            label="모임 개설"
                        />
                    </>
                )}
                <ActionButton
                    onClick={() => router.push(`/users/update/${user}`)}
                    icon={<FaUserEdit />}
                    label="내정보수정"
                />
                <ActionButton
                    onClick={() => router.back()}
                    icon={<FaArrowLeft />}
                    label="뒤로가기"
                    className={styles['back-button']}
                />
            </div>
        </div>
    );
}
