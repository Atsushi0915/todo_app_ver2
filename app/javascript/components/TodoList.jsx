import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im'
import { AiFillEdit } from 'react-icons/ai'


function TodoList() {
  const [todos, setTodos] = useState([])
  const [searchName, setSearchName] = useState('')    //検索文字入力のuseState。入力した文字を保持する。

  useEffect(() => {
    axios.get('/api/v1/todos.json')    //todos_controller.rbの index アクションから todos の json 形式でデータを取得。
      .then(resp => {
        setTodos(resp.data);
      })
      .catch(e => {
        console.log(e);
      })
  }, [])

  //↓↓「Remove All」前件削除
  const removeAllTodos = () => {
    const sure = window.confirm('Are you sure?');  // キャンセルを押すと「false」が返ってくる。

    if (sure) {
      axios.delete('/api/v1/todos/destroy_all')
        .then(resp => {
          setTodos([])    // 全件削除した時に setTodos は空になる。
        })
        .catch(e => {
          console.log(e)
        })
    }
  }

  const updateIsCompleted = (index, val) => {
    var data = {          // map関数で取り出した todos のデータ(val)。index は配列番号。
      id: val.id,
      name: val.name,
      is_completed: !val.is_completed
    }
    axios.patch(`/api/v1/todos/${val.id}`, data)
      .then(resp => {
        const newTodos = [...todos]     // 配列を展開
        newTodos[index].is_completed = resp.data.is_completed
        setTodos(newTodos)  //展開した配列の index 番号の is_completed を　レスポンスdataのis_completedに変更して setTodos()にセット
      })
  }

  const searchTodos = todos.filter((val) => {         // todos の配列を val に入れてfilter。

    if (searchName === "") {
      return val                   // searchName が空白の時、val を返す。
    } else if (val.name.toLowerCase().includes(searchName.toLowerCase())) {
      return val
    }                     // valのname を小文字にしたものの中に、searchNameの小文字にしたものが含まれている場合。
  })

  return (
    <>
      <h1>Todo List</h1>
      <SearchAndButtton>             {/* 検索ボックスと削除ボタン */}
        <SearchForm
          type="text"
          placeholder="Search todo..."
          onChange={(event) => {
            setSearchName(event.target.value)
          }}
        />                             {/* 入力欄 */}
        <RemoveAllButton onClick={removeAllTodos}>      {/* 前件削除のボタン */}
          Remove All
        </RemoveAllButton>
      </SearchAndButtton>


      <div>
        {searchTodos.map((val, key) => {       // 返ってきた配列(val)を展開。
          return (
            <Row key={key}>
              {val.is_completed ? (
                <CheckedBox>
                  <ImCheckboxChecked onClick={() => updateIsCompleted(key, val)} />
                </CheckedBox>
              ) : (
                <UncheckedBox>
                  <ImCheckboxUnchecked onClick={() => updateIsCompleted(key, val)} />
                </UncheckedBox>
              )}
              <TodoName is_completed={val.is_completed}>
                {val.name}
              </TodoName>
              <Link to={"/todos/" + val.id + "/edit"}>
                <EditButton>
                  <AiFillEdit />
                </EditButton>
              </Link>
            </Row>
          )
        })}
      </div>
    </>
  )
}

// ＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃

const SearchAndButtton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SearchForm = styled.input`
  font-size: 20px;
  width: 100%;
  height: 40px;
  margin: 10px 0;
  padding: 10px;
`

const RemoveAllButton = styled.button`
  width: 16%;
  height: 40px;
  background: #f54242;
  border: none;
  font-weight: 500;
  margin-left: 10px;
  padding: 5px 10px;
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
`

const TodoName = styled.span`
  font-size: 27px;
  ${({ is_completed }) => is_completed && `
    opacity: 0.4;
  `}
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 7px auto;
  padding: 10px;
  font-size: 25px;
`

const CheckedBox = styled.div`
  display: flex;
  align-items: center;
  margin: 0 7px;
  color: green;
  cursor: pointer;
`

const UncheckedBox = styled.div`
  display: flex;
  align-items: center;
  margin: 0 7px;
  cursor: pointer;
`

const EditButton = styled.span`
  display: flex;
  align-items: center;
  margin: 0 7px;
`


export default TodoList
