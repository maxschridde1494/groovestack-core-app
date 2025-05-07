import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser, Layout } from 'react-admin';
import { dataProvider } from './dataProvider';

export const App = () => (
    <Admin 
      dataProvider={dataProvider}
      layout={Layout}
    >
      <Resource 
        name="users" 
        list={ListGuesser} 
        edit={EditGuesser} 
        show={ShowGuesser} 
      />
    </Admin>
);