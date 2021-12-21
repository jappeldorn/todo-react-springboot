import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import Todo from './components/Todo';
import TodoForm from './components/TodoForm';
import ProgressChart from './components/ProgressChart';
import Navigation from './components/NavigationBar';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Footer } from './components/Footer';

const client = axios.create({
  baseURL: '/api',
});

function App() {
  const [todos, setTodos] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [chartFilter, setChartFilter] = useState(null);
  const [readOnly, setReadOnly] = useState(false);
  const [username, setUsername] = useState('User');
  const [theme, setTheme] = useState('light');
  const [prioritySortDesc, setPrioritySort] = useState(true);

  useEffect(() => {
    client.get('/user').then((response) => {
      const { data } = response || {};
      const readOnly =
        data.authorities.filter((a) => a.authority === 'ROLE_USER').length > 0;
      setReadOnly(readOnly);
      setUsername(data.username);
    });
    refreshData(prioritySortDesc);
  }, []);

  const addTodo = (item, priority) => {
    client
      .post('/todo', {
        item,
        priority,
      })
      .then((response) => {
        if (response && response.data) {
          refreshData(prioritySortDesc);
        }
      });
  };

  const completeTodo = (item) => {
    client
      .put(`/todo/${item.id}`, {
        ...item,
        complete: !item.complete,
      })
      .then((response) => {
        if (response && response.data) {
          refreshData(prioritySortDesc);
        }
      });
  };

  const removeTodo = (item) => {
    client.delete(`/todo/${item.id}`).then(() => {
      refreshData(prioritySortDesc);
    });
  };

  const refreshData = (prioritySort) => {
    setChartFilter(null);
    client
      .get(`/todo?sortDirection=${!!prioritySort ? 'desc' : 'asc'}`)
      .then((response) => {
        const { data } = response;
        setTodos(data || []);

        client.get('/todo/counts').then((response) => {
          const { data } = response;
          setChartData(getChartData(data));
        });
      });
  };

  const onClickChartItem = (filter) => {
    setChartFilter(filter.name);
  };

  const switchTheme = (theme) => {
    setTheme(theme);
  };

  const onClickSortPriority = () => {
    setPrioritySort(!prioritySortDesc);
    refreshData(!prioritySortDesc);
  };

  const getChartData = (data) => {
    let chartData = [];
    if (!data.all || data.all === 0) {
      return chartData;
    }

    if (data.complete && data.complete > 0) {
      chartData.push({ name: 'Completed', count: data.complete });
    }

    if (data.urgent && data.urgent > 0) {
      chartData.push({ name: 'Urgent', count: data.urgent });
    }

    if (data.outstanding && data.outstanding > 0) {
      chartData.push({ name: 'Outstanding', count: data.outstanding });
    }
    return chartData;
  };

  return (
    <div className={classnames('app', { 'bg-dark': theme === 'dark' })}>
      <Navigation theme={theme} user={username} />
      <div
        className={classnames('container-fluid mt-5 main-content', {
          'bg-dark': theme === 'dark',
        })}
      >
        <div className='row'>
          <div class='col-12 col-xl-7'>
            <div
              className={classnames('card', {
                'bg-dark text-white border border-white': theme === 'dark',
              })}
            >
              <div
                className={classnames(
                  'card-header d-flex justify-content-between',
                  {
                    'border border-white': theme === 'dark',
                  }
                )}
              >
                <h4 className='card-header-title'>My List</h4>
                <a href='/#' onClick={() => onClickSortPriority()}>
                  {!!prioritySortDesc ? (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='16'
                      height='16'
                      fill='currentColor'
                      class='bi bi-sort-up'
                      viewBox='0 0 16 16'
                    >
                      <path d='M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707V12.5zm3.5-9a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z' />
                    </svg>
                  ) : (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='16'
                      height='16'
                      fill='currentColor'
                      class='bi bi-sort-down'
                      viewBox='0 0 16 16'
                    >
                      <path d='M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z' />
                    </svg>
                  )}
                </a>
              </div>
              <div className='card-body'>
                <div className='list-group'>
                  {todos &&
                    todos.length > 0 &&
                    todos.map((todo, index) => {
                      if (
                        chartFilter &&
                        ((chartFilter === 'Completed' && !todo.complete) ||
                          (chartFilter === 'Outstanding' && !!todo.complete) ||
                          (chartFilter === 'Urgent' && todo.priority !== 2))
                      ) {
                        return null;
                      }
                      return (
                        <Todo
                          key={index}
                          index={index}
                          todo={todo}
                          completeTodo={() => completeTodo(todo)}
                          removeTodo={() => removeTodo(todo)}
                          readOnly={readOnly}
                          theme={theme}
                        />
                      );
                    })}
                </div>
                {!readOnly ? (
                  <TodoForm
                    theme={theme}
                    addTodo={(task, priority) => addTodo(task, priority)}
                  />
                ) : null}
              </div>
            </div>
          </div>
          <div className='col-12 col-xl-5 p-0'>
            <div
              className={classnames('card', {
                'bg-dark text-white border border-white': theme === 'dark',
              })}
            >
              <div
                className={classnames('card-header', {
                  'border border-white': theme === 'dark',
                })}
              >
                <h4 className='card-header-title'>Progress</h4>
              </div>
              <div className='card-body'>
                <ProgressChart
                  data={chartData}
                  onClickChartItem={(item) => onClickChartItem(item)}
                  theme={theme}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer theme={theme} switchTheme={(theme) => switchTheme(theme)} />
    </div>
  );
}

export default App;
