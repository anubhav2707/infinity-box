import "./App.css";
import { Tabs, Space, Input } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { AudioOutlined } from "@ant-design/icons";
import Fuse from 'fuse.js'

const App = () => {
  const [data, setData] = useState({ Dior: [], Nyx: [], Clinique: [] });
  const [searchResults, setSearchResults] = useState({ Dior: [], Nyx: [], Clinique: [] })
  const [searched, setSearched] = useState(false)
  const brands = ["Dior", "Nyx", "Clinique"];
  const [loading, setLoading] = useState(true);
  const { TabPane } = Tabs;
  const {Search } = Input

  const onSearch = (searchValue) => {
    if(searchValue == ''){
      setSearched(false)
      return
    }
    const fuseD = new Fuse(data['Dior'], {
      keys: ['name']
    })
    const fuseN = new Fuse(data['Nyx'], {
      keys: ['name']
    })
    const fuseC = new Fuse(data['Clinique'], {
      keys: ['name']
    })

    const resD = fuseD.search(searchValue)
    const resN = fuseN.search(searchValue)
    const resC = fuseC.search(searchValue)

    setSearchResults(data => ({...data, Dior: resD}))
    setSearchResults(data => ({...data, Nyx: resN}))
    setSearchResults(data => ({...data, Clinique: resC}))
    setSearched(true)
    console.log(searchResults)
  }


  useEffect(() => {
    const fetchData = async () => {
      const resDior = await axios.get(
        "https://makeup-api.herokuapp.com/api/v1/products.json?brand=dior"
      );
      setData((data) => ({ ...data, Dior: resDior.data }));

      const resN = await axios.get(
        "https://makeup-api.herokuapp.com/api/v1/products.json?brand=nyx"
      );
      setData((data) => ({ ...data, Nyx: resN.data }));

      const resC = await axios.get(
        "https://makeup-api.herokuapp.com/api/v1/products.json?brand=clinique"
      );
      setData((data) => ({ ...data, Clinique: resC.data }));
      // console.log(resDior.data, resN.data)
      console.log(resDior.data.length, resN.data.length, resC.data.length);
    };
    fetchData();
    setLoading(false);
  }, []);

  useEffect(() => {

    console.log(data)
  }, [data]);
  return loading ? (
    <div>Loading...</div>
  ):(
    <div className="wrapper">
      <div>
        <Search className="search_box"
          placeholder="input search text"
          allowClear
          enterButton="Search"
          size="large"
          
          onSearch={onSearch}
        />
      </div>

      {
        searched ? <div>
          <h2>
    Search Results:
    </h2>
    {
      brands.map(brand => {
        return <div className="searchSection">
          <h3>{brand} ({searchResults[brand].length})</h3>
          <div className="grid">

            {searchResults[brand].map(({item}, _id) => {
              return (
                <div className="box_wrapper" key={_id}>
                  <div>
                    <img
                      src={item.image_link}
                      className="image"
                    ></img>
                  </div>
                  <div>
                    <div className="headings">{item.name}</div>
                    <div className="prices">
                    <b>₹ {item.price} </b>
                    </div>
                    <div className="details">
                      <div>{item.description?.slice(0, 100)}...</div>
                     </div>
                  </div>
                </div>
              );
            })
          }
          </div>
        </div>
      })
    }
        </div> : 
        <Tabs defaultActiveKey="0">
        {brands.map((brand, _id) => {
          return (
            <TabPane tab={brand} key={brand} className="grid">
              {data[brand].map((product, _id) => {
                return (
                  <div className="box_wrapper" key={_id}>
                    <div>
                      <img
                        src={product.image_link}
                        className="image"
                      ></img>
                    </div>
                    <div>
                      <div className="headings">{product.name}</div>
                      <div className="prices">
                      <b>₹ {product.price} </b>
                      </div>
                      <div className="details">
                        <div>{product.description?.slice(0, 100)}...</div>
                       </div>
                    </div>
                  </div>
                );
              })}
            </TabPane>
          );
        })}
      </Tabs>
      }
      
    </div>
  );
};

export default App;
