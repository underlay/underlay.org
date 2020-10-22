import React from "react";
import { Avatar as AvatarEvergreen, AvatarProps } from 'evergreen-ui';

const Avatar: React.FC<AvatarProps> = function(props) {
	return <AvatarEvergreen {...props} borderRadius="3px" />
}

export default Avatar;
