import { useSelector } from "react-redux";

const HomePage = () => {
    const { user } = useSelector(state => state.user);
    const { tasks } = useSelector((state) => state.tasks);
    



    return (
        <>

            <h2>This is Home page {user?.id} </h2>
            <div>

                {tasks.map((task) => (
                    <div key={task.id}>
                        <p>
                            {task.id}
                            </p>
                    </div>
                )
                    
                )}
            </div>


        </>
    );
};

export default HomePage;