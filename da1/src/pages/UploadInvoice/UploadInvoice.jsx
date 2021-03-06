import React, { useEffect, useState } from 'react';
import './UploadInvoice.scss'
import axios from 'axios';
import { BsPlusSquare, BsPlusCircle } from "react-icons/bs";
import { FormManager, NumberInput, TextInput } from './../../components/CustomForm/CustomForm';

function UploadInvoice(props) {
    const [products, setProducts] = useState([])
    const [carts, setCarts] = useState([])
    const [mess, setMess] = useState('')

    const { isError, isSubmit, submitTrigger, onFormChange, watch, handleSubmit } = FormManager({
        initialValue: {
            Ho: '',
            Ten: '',
            SoNha: '',
            Duong: '',
            Phuong: '',
            Quan: '',
            Tpho: '',
            DienThoai: '',
        }
    })

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products')

                setProducts(response.data)

            } catch (error) {
                console.log(error)
            }
        }

        fetchProducts()
    }, [])

    const addProduct = (item) => {
        const itemNew = {
            ...item,
            SoLuong: 1,
        }
        setCarts([itemNew, ...carts])
        const filteredAry = products.filter((e) => { return e.MaSP !== item.MaSP })
        setProducts(filteredAry)
    }

    const deleteProduct = (item) => {
        setProducts([item, ...products])
        const filteredAry = carts.filter((e) => { return e.MaSP !== item.MaSP })
        setCarts(filteredAry)
    }

    const plusAmount = (item) => {

        const cartsTemp = [...carts]
        const objIndex = carts.findIndex((e => e.MaSP == item.MaSP))

        if (item.SoLuongTon <= cartsTemp[objIndex].SoLuong) return

        cartsTemp[objIndex].SoLuong += 1

        setCarts(cartsTemp)
    }

    const minusAmount = (item) => {
        const cartsTemp = [...carts]
        const objIndex = carts.findIndex((e => e.MaSP == item.MaSP))

        if (cartsTemp[objIndex].SoLuong <= 1) return

        cartsTemp[objIndex].SoLuong -= 1

        setCarts(cartsTemp)
    }

    const handleChangeAMount = (item, value) => {
        if (isNaN(value)) return

        const cartsTemp = [...carts]
        const objIndex = carts.findIndex((e => e.MaSP == item.MaSP))

        if (item.SoLuongTon < value) return

        cartsTemp[objIndex].SoLuong = Number(value)

        setCarts(cartsTemp)
    }

    const checkValue = (item) => {
        const cartsTemp = [...carts]
        const objIndex = carts.findIndex((e => e.MaSP == item.MaSP))

        if (cartsTemp[objIndex].SoLuong <= 0) {

            cartsTemp[objIndex].SoLuong = 1
        } else {
            return
        }
        setCarts(cartsTemp)
    }

    const onSubmit = async (data) => {
        console.log("???? ~ file: UploadInvoice.jsx ~ line 108 ~ onSubmit ~ data", data)

        if (carts.length <= 0) {
            setMess('Gi??? h??ng tr???ng')
            return
        }
        try {
            await axios.post('http://localhost:5000/api/invoice/upload', {
                products: carts,
                customer: data,
            }).then((r) => setMess(r.data.mess))

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <h1>
                Th??ng tin kh??ch h??ng
            </h1>
            <div className='customer'>
                <div className='customer__item'>
                    <TextInput
                        className='customer__item'
                        name='Ho'
                        label="H???"
                        onChange={onFormChange}
                        maxLength={10}

                        required
                        isSubmit={isSubmit}
                    />
                    <TextInput
                        name='Ten'
                        label="T??n"
                        onChange={onFormChange}
                        maxLength={10}

                        required
                        isSubmit={isSubmit}
                    />
                </div>
                <div className='customer__item'>
                    <div>
                        <TextInput
                            className='customer__item'
                            name='SoNha'
                            label="S??? nh??"
                            onChange={onFormChange}

                            required
                            isSubmit={isSubmit}
                        />
                        <TextInput
                            name='Duong'
                            label="???????ng"
                            onChange={onFormChange}

                            required
                            isSubmit={isSubmit}
                        />
                    </div>
                    <div>

                        <TextInput
                            name='Phuong'
                            label="Ph?????ng"
                            onChange={onFormChange}

                            required
                            isSubmit={isSubmit}
                        />
                        <TextInput
                            name='Quan'
                            label="Qu???n"
                            onChange={onFormChange}

                            required
                            isSubmit={isSubmit}
                        />
                    </div>

                </div>
                <TextInput
                    name='Tpho'
                    label="Th??nh Ph???"
                    onChange={onFormChange}

                    required
                    isSubmit={isSubmit}
                />

                <NumberInput
                    name='DienThoai'
                    label="S??? ??i???n tho???i"
                    onChange={onFormChange}
                    minLength={9}
                    maxLength={11}
                    positive

                    required
                    isSubmit={isSubmit}
                />

            </div>
            <div className='line'>

            </div>
            <div className="cart">
                <h1>
                    Gi??? h??ng
                </h1>

                <table className='products'>
                    {
                        carts.length > 0 ?
                            <tr>
                                <th>T??n S???n Ph???m</th>
                                <th>Gi??</th>
                                <th>S??? l?????ng t???n kho</th>
                                <th>M?? t???</th>
                                <th>S??? l?????ng mua</th>
                            </tr>
                            : <div>
                                Tr???ng
                            </div>
                    }

                    {
                        carts.map((item, item_idx) => (

                            <tr key={item_idx} className='product'>
                                <td className='product__item'>
                                    {
                                        item.TenSP
                                    }
                                </td>
                                <td className='product__item'>
                                    {
                                        item.Gia
                                    }
                                </td>
                                <td className='product__item'>
                                    {
                                        item.SoLuongTon
                                    }
                                </td>
                                <td className='product__item'>
                                    {
                                        item.Mota
                                    }
                                </td>
                                <td className='product__item item-input'>
                                    <button
                                        onClick={() => minusAmount(item)}
                                    >-</button>
                                    <div
                                        className='input'
                                    >

                                        <input
                                            value={item.SoLuong}
                                            onChange={(e) => handleChangeAMount(item, e.target.value)}
                                            onBlur={() => checkValue(item)}
                                        />

                                    </div>
                                    <button
                                        onClick={() => plusAmount(item)}
                                    >+</button>
                                </td>
                                <td className='product__item btn-delete'
                                    onClick={() => deleteProduct(item)}
                                >
                                    <div className='delete'>
                                        <BsPlusCircle />
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </table>
                <div className='mess'>
                    {
                        mess ? mess : ""
                    }
                </div>
                <div
                    className='cart-btn'
                    onClick={() => handleSubmit(onSubmit)}
                >
                    Mua h??ng
                </div>
            </div>


            <div className='line'>

            </div>
            <h1>
                S???n ph???m
            </h1>
            <table className='products'>
                <tr>
                    <th>T??n S???n Ph???m</th>
                    <th>Gi??</th>
                    <th>S??? l?????ng t???n kho</th>
                    <th>M?? t???</th>
                </tr>

                {
                    products.map((item, item_idx) => (

                        <tr key={item_idx} className='product'>
                            <td className='product__item'>
                                {
                                    item.TenSP
                                }
                            </td>
                            <td className='product__item'>
                                {
                                    item.Gia
                                }
                            </td>
                            <td className='product__item'>
                                {
                                    item.SoLuongTon
                                }
                            </td>
                            <td className='product__item'>
                                {
                                    item.Mota
                                }
                            </td>
                            <td className='product__item btn__add'
                                onClick={() => addProduct(item)}
                            >
                                <div className='add'>
                                    <BsPlusSquare />
                                </div>
                            </td>
                        </tr>
                    ))
                }
            </table>

        </div>
    );
}

export default UploadInvoice;