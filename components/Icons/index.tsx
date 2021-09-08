import Icon, { Props } from "./Icon";

interface LocalProps extends Omit<Props, 'icon'> {}

export const Collection: React.FC<LocalProps> = (props) => <Icon {...props} icon="collection" />;
export const Community: React.FC<LocalProps> = (props) => <Icon {...props} icon="community" />;
export const Edit: React.FC<LocalProps> = (props) => <Icon {...props} icon="edit" />;
export const Home: React.FC<LocalProps> = (props) => <Icon {...props} icon="home" />;
export const Rocket: React.FC<LocalProps> = (props) => <Icon {...props} icon="rocket" />;
export const User: React.FC<LocalProps> = (props) => <Icon {...props} icon="user" />;
export const Schema: React.FC<LocalProps> = (props) => <Icon {...props} icon="schema" />;
export const Discussion: React.FC<LocalProps> = (props) => <Icon {...props} icon="discussion" />;
export const Provenance: React.FC<LocalProps> = (props) => <Icon {...props} icon="provenance" />;
