import "./App.css";
import { Tabs } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";



const App = () => {
  const [data, setData] = useState({ Dior: [], Nyx: [], Clinique: [] });
  const brands = ["Dior", "Nyx", "Clinique"];
  const [loading, setLoading] = useState(true)
  const { TabPane } = Tabs;
  useEffect(() => {
    const fetchData = async () => {
      const resDior = await axios.get(
        "https://makeup-api.herokuapp.com/api/v1/products.json?brand=dior"
      );
      setData(data => ({ ...data, 'Dior': resDior.data }));

      const resN = await axios.get(
        "https://makeup-api.herokuapp.com/api/v1/products.json?brand=nyx"
      );
      setData(data => ({ ...data, 'Nyx': resN.data }));

      const resC = await axios.get(
        "https://makeup-api.herokuapp.com/api/v1/products.json?brand=clinique"
      );
      setData(data => ({ ...data, 'Clinique': resC.data }));
      // console.log(resDior.data, resN.data)
      console.log(resDior.data.length, resN.data.length, resC.data.length)
    };
    fetchData();
    setLoading(false)
  }, []);

  useEffect(() => {
    console.log('Changed', data['Dior'].length, data['Nyx'].length, data['Clinique'].length)
  }, [data])
  return (
    loading ? <div>Loading...</div> :
    <>
      <Tabs defaultActiveKey="0">
        {brands.map((brand, _id) => {
          return (
            <TabPane tab={brand} key={brand} className="grid">
              {data[brand].map((product, _id) => {
                return (
                  <div className="box_wrapper" key={_id}>
                    <div style={{ marginInline: 10 }}>sjk</div>
                    <div>
                      {/* <img src={pic}></img> */}
                      <div className="headings">{product.name}</div>
                      <div className="details">
                        <div>Rs: {product.price} </div>
                        <div>{product.details}</div>
                        {product.brand}
                      </div>
                    </div>
                  </div>
                );
              })}
            </TabPane>
          );
        })}
      </Tabs>
    </>
  );
};

export default App;
