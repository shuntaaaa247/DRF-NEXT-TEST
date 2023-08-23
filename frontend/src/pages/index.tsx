import axios from "axios"
import React, { useEffect, useState, useRef } from "react"

type PostData = {
  id: number,
  title: "string",
  description: "string" //null=tureにしたけどnullの時は""になるっぽい
}


export default function Home() {
  const [posts, setPosts] = useState<PostData[]>([]) //APIから取得したデータ
  const [newTitle, setNewTitle] = useState<string>("")//APIにPostするデータ
  const [newDescription, setNewDescription] = useState<string>("") //APIにPostするデータ

  useEffect(() => {
    console.log("useStateが呼ばれましたよぉ〜")
    getData()
  }, [])

  const getData = async () => {
    await axios.get("http://127.0.0.1:8000/api/posts/") //APIからデータを取得
    .then(res => {
      setPosts(res.data.reverse())//逆順で保存
      console.log(res)
    })
    .catch(err => {
      console.log(err)
      alert("APIエラー")
    })
  }

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(() => e.target.value)
  }

  const handleChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewDescription(() => e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {// input(textタイプ)でテキスト入力中にエンターを押すとsubmitされてしまうのでそれを阻止するため
    e.preventDefault()
  }

  const addPost = () => { //投稿をAPIにポスト
    axios.post("http://127.0.0.1:8000/api/posts/", {"title": newTitle, "description": newDescription})
      .then(res => {
        console.log(res.data)//postしたデータをコンソールに出力
        setPosts([res.data, ...posts])
      })
      .catch(err => {
        console.log(err)
        alert("APIエラー")
      })
    setNewTitle("")
    setNewDescription("")
  }

  const deletePost = (postId: number) => {
    axios.delete(`http://127.0.0.1:8000/api/posts/${postId}/`)
      .then(res => {
        console.log("削除完了")
        setPosts(posts.filter(data => {return data.id !== postId}))
      })
      .catch(err => {
        console.log(err)
        alert("APIエラー")
      })
  }

  return (
    <div>
      {/* input(textタイプ)でテキスト入力中にエンターを押すとsubmitされてしまうのでそれを阻止するためのhandleSubmit */}
      <form onSubmit={handleSubmit}> 
        <input value={newTitle} onChange={handleChangeTitle} type="text" name="newTitle" className="border border-black-200 m-2"></input>
        <br />
        <textarea value={newDescription} onChange={handleChangeDescription} rows={4} name="newDescription" className="border border-black-200 m-2" />
        {/* typeをbuttonにすることでボタンを押した時にページがリロードされない */}
        <br />
        <button type="button" onClick={addPost} className="bg-gray-200">Post</button> 
      </form>
      <br />
      <ul>
        {
          posts.map(post => 
            <li key={post.id}>
              <h1 className="text-xl">{post.id}:{post.title}</h1>
              <p>{post.description}</p>
              <button onClick={() => {deletePost(post.id)}} className="bg-gray-300 mb-3">削除</button><br />
              {/* <button onClick={() => setDeletedPost(post)} className="bg-gray-300 mb-3">削除</button><br /> */}
            </li>)
        }
      </ul>
    </div>
  )
}
