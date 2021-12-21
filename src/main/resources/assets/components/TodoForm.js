import React, { useState } from 'react';
import classnames from 'classnames';

const TodoForm = ({ addTodo, theme }) => {
  const priorityMap = {
    0: 'Low',
    1: 'Priority',
    2: 'Urgent',
  };

  const [value, setValue] = useState('');
  const [priority, setPriority] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    addTodo(value, priority);
    setValue('');
    setPriority(1);
  };

  const onClickPriority = (priority) => {
    setPriority(priority);
    setDropdownOpen(false);
  };

  const toggleDropDown = (toggle) => {
    setDropdownOpen(toggle);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div class='input-group mb-3 mt-3'>
        <button
          onClick={() => toggleDropDown(!dropdownOpen)}
          className={classnames(
            'btn btn-outline-primary dropdown-toggle',
            { show: dropdownOpen },
            { 'btn-outline-danger': priority === 2 }
          )}
          type='button'
          data-bs-toggle='dropdown'
          aria-expanded={dropdownOpen}
        >
          {priorityMap[priority]}
        </button>
        <ul className={classnames('dropdown-menu', { show: dropdownOpen })}>
          <li>
            <a
              onClick={() => onClickPriority(2)}
              className='dropdown-item'
              href='/#'
            >
              Urgent
            </a>
          </li>
          <li>
            <a
              onClick={() => onClickPriority(0)}
              className='dropdown-item'
              href='/#'
            >
              Low
            </a>
          </li>
          {priority !== 1 ? (
            <>
              <li>
                <hr class='dropdown-divider' />
              </li>
              <li>
                <a
                  onClick={() => onClickPriority(1)}
                  className='dropdown-item'
                  href='/#'
                >
                  Reset Priority
                </a>
              </li>
            </>
          ) : null}
        </ul>
        <input
          type='text'
          className={classnames('form-control form-control-lg', {
            'bg-dark text-white': theme === 'dark',
          })}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label='Enter task'
          placeholder='Enter task'
        />
      </div>
    </form>
  );
};

export default TodoForm;
