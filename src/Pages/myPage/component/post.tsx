import styled from "styled-components";
import LikeButton from "../../../components/likeBtn";
import CommentButton from "../../../components/comBtn";
import Comment from "../../../components/comment";
import { useEffect, useState } from "react";
import ProfileIcon from "../../../assets/images/icon-user.png"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../features/store";
import Dialog from "../../../components/dialog";
import { useNavigate } from "react-router-dom";
import { deletePost } from "../../../features/post/postsSlice";
import { FaEllipsisV } from "react-icons/fa";

interface Comment {
    author: string;
    text: string;
  }
  
  interface PostProps {
    post: {
      _id: string;
      id: string;
      userId: {
        _id: string;
        nickName: string;
        profilePhoto: string;
      }; 
      bookTitle: string;
      bookAuthor: string;
      title: string;
      text: string;
      date: string;
      author: string;
      profilePhoto: string;
      likes: string[];
      comments: Comment[];
      liked: boolean;   
    };
  }
  

const StyledPost = styled.div`
  width: 100%;
  max-width: 846px;
  border: 1px solid #878787;
  box-shadow: 0 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  border-radius: 16px;
  margin: auto;
  margin-bottom: 28px;
  padding: 16px 16px 5px 16px;

  @media (max-width: 480px) {
    max-width: 330px;
    padding: 8px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;
const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
`;
const ProfilePhoto = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 8px;
`;
const Name = styled.span`
  font-weight: bold;
  font-size: 16px;
`;
const TitleDate = styled.div``;

const Date = styled.div`
  font-size: 12px;
  color: #666;
`;
const Title = styled.div`
    font-size: 20px;
    font-weight: 600;
  text-align: left;
  margin: 0;
`;
const Content = styled.p`
  color: #014421;
  font-size: 20px;
  margin-bottom: 16px;
  min-height: 70px;
`;
const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  margin-bottom: 8px;
  
`;
const Inner = styled.div`
  display: flex;
  gap: 10px;
  align-self: flex-end;
`;
const CommentSectionContainer = styled.div`
  width: 100%;
  margin-top: 8px;
  margin-bottom: 10px;
`;
const BookTit = styled.div``;
const BTitle = styled.div``;
const BAuthor = styled.div`
  color: #a4a4a4;
`;
const OptionsIcon = styled(FaEllipsisV)`
  cursor: pointer;
  font-size: 20px;
  margin-left: 8px;
  color: #666;
`;

const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ActionButton = styled.div`
  padding: 9px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background: #e2e6ea;
  }
`;
const Post: React.FC<PostProps> = ({ post }) => {
  const { _id, bookTitle, bookAuthor, title, text, date, userId, likes, comments } = post;
  
    const [commentsVisible, setCommentsVisible] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const currentUser = useSelector((state: RootState) => state.user.user);
    const isOwner = currentUser?._id === userId?._id;
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const handleDialogOpen = () => {
      setIsDialogOpen(true);
    };
  
    const handleDialogClose = () => {
      setIsDialogOpen(false);
    };
    const toggleCommentsVisibility = () => {
      setCommentsVisible(!commentsVisible);
    };
    const handleEdit = () => {
      console.log("Navigating with post ID:", _id);
      navigate("/post/write", {
          state: {
              post: {
                  _id,
                  title,
                  text,
                  bookTitle,
                  bookAuthor,
              },
          },
      });
  };
  const handleDelete = async (id: string) => {
      try {
          await dispatch(deletePost({ id })).unwrap();
          setIsDialogOpen(false);
      } catch (error: any) {
          console.log(error)
      }
  };
    return (
      <StyledPost>
        <Header>
          <TitleDate>
            <Title>{title}</Title>
            <Date>{date}</Date>
          </TitleDate>
          <ProfileInfo>
            <ProfilePhoto src={ProfileIcon} alt="Profile" />
            <Name>{userId?.nickName}</Name>
            {isOwner && (
            <>
              <OptionsIcon onClick={handleDialogOpen} />
              {isDialogOpen && (
                <Dialog isOpen={isDialogOpen} onClose={handleDialogClose}>
                  <DialogContainer>
                    <ActionButton onClick={handleEdit}>수정</ActionButton>
                    <ActionButton onClick={()=>handleDelete(_id)}>삭제</ActionButton>
                  </DialogContainer>
                </Dialog>
              )}
            </>
          )}
          </ProfileInfo>
        </Header>
        <Content>{text}</Content>
        <Footer>
          <Inner>
            <LikeButton postId={_id}/>
            <CommentButton
              count={comments.length}
              onClick={toggleCommentsVisibility}
            />
          </Inner>
          <BookTit>
            <BTitle>{bookTitle}</BTitle>
            <BAuthor>{bookAuthor}</BAuthor>
          </BookTit>
        </Footer>
        {commentsVisible && (
          <CommentSectionContainer>
            <Comment visible={commentsVisible} postId={_id}/>
          </CommentSectionContainer>
        )}
      </StyledPost>
    );
  };
  

export default Post;
