import { LikeIcon } from '../../icons/icons';
import { handleLikeImage } from '../../api/ImageAPI';

const Like = ({ setLikes, likes, img }) => {

    return (
        <div className="flex flex-row justify-end" onClick={(e) => handleLikeImage(e, img, setLikes, likes)} >
            <div
                className="bg-green-500 shadow-lg shadow- shadow-green-600 text-white cursor-pointer px-3 text-center items-center py-1 rounded-xl flex space-x-2 flex-row">
                <LikeIcon />
                <span>{likes}</span>
            </div>
        </div>
    );
}

export default Like;