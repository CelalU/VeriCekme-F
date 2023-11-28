import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const [data, setData] = useState([]);
  const [ustHesap, setUstHesap] = useState([]);
  const [filteredData2, setFilteredData2] = useState([]);
  const [expandedUstHesap, setExpandedUstHesap] = useState(null);
  const [expandedAltHesaplar, setExpandedAltHesaplar] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/data/sync")
      .then((res) => {
        const dataArray = res.data.data;
        setData(dataArray);
        const uniqueUstHesapList = Array.from(
          new Set(
            dataArray
              .filter((item) => item.tipi === "A")
              .map((item) => item.ust_hesap_id)
          )
        );
        setUstHesap(uniqueUstHesapList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getTotalBorcForUstHesap = (ustHesapId) => {
    const altHesaplar = data.filter(
      (item) => item.tipi === "A" && item.ust_hesap_id === ustHesapId
    );
    const totalBorc = altHesaplar.reduce(
      (total, altHesap) => total + altHesap.borc,
      0
    );
    return totalBorc;
  };

  const handleUstHesapClick = (ustHesapId) => {
    const altHesaplar = data.filter(
      (item) => item.tipi === "A" && item.ust_hesap_id === ustHesapId
    );
    setFilteredData2(altHesaplar);
    setExpandedUstHesap(ustHesapId);
    setExpandedAltHesaplar([]);
  };

  const handleUstHesapClickB = (ustHesapId) => {
    const Filt = data.find((item) => item.id === ustHesapId);
    if (Filt.tipi === "B") {
      return;
    }

    const altHesaplar = data.filter(
      (item) => item.tipi === "B" && item.ust_hesap_id === ustHesapId
    );

    if (expandedUstHesap === ustHesapId) {
      setFilteredData2([]);
      setExpandedUstHesap(null);
    } else {
      setFilteredData2(altHesaplar);
      setExpandedUstHesap(ustHesapId);
    }

    // Sadece bir tane üst hesabın genişletilme durumunu takip edeceğiz
    setExpandedAltHesaplar([ustHesapId]);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col">
          <h2>Üst Hesaplar</h2>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Hesap Kodu</th>
                <th>Toplam Borç</th>
                <th>Genişlet</th>
              </tr>
            </thead>
            <tbody>
              {ustHesap.map((ustHesapId) => (
                <tr
                  key={ustHesapId}
                  onClick={() => handleUstHesapClick(ustHesapId)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{ustHesapId}</td>
                  <td>{getTotalBorcForUstHesap(ustHesapId)}</td>
                  <td>{expandedUstHesap === ustHesapId ? "-" : "+"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col">
          <h2>Alt Hesaplar</h2>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Hesap Kodu</th>
                <th>Toplam Borç</th>
              </tr>
            </thead>
            <tbody>
              {filteredData2.map((item, index) => (
                <tr key={item.id} onClick={() => handleUstHesapClickB(item.id)}>
                  <td>
                    {item.hesap_kodu}{" "}
                    {expandedAltHesaplar.includes(item.ust_hesap_id) &&
                    index === 0
                      ? "+"
                      : "-"}
                  </td>
                  <td>{item.borc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
