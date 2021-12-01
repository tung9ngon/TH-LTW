/* eslint-disable no-underscore-dangle */
import {
  getBieuMauAdmin,
  postBieuMauAdmin,
  putBieuMauAdmin,
  deleteBieuMauAdmin,
  userGetAllBieuMau,
  getDonSinhVien,
  postDonSinhVien,
  chuyenVienDieuPhoiDuyetDon,
  getDonThaoTacChuyenVienDieuPhoi,
  getAllBieuMauChuyenVienDieuPhoi,
  getAllBieuMauChuyenVienTiepNhan,
  getDonThaoTacChuyenVienXuLy,
  chuyenVienXuLyDuyetDon,
  dieuPhoiDon,
  getTrangThaiDon,
  getBieuMauById,
  adminGetAllBieuMau,
  adminGetDonSinhVien,
  adminGetTrangThaiDon,
} from '@/services/DichVuMotCuaV2/dichvumotcuav2';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<DichVuMotCuaV2.BieuMau[]>([]);
  const [danhSachDon, setDanhSachDon] = useState<DichVuMotCuaV2.Don[]>([]);
  const [danhSachDonThaoTac, setDanhSachDonThaoTac] = useState<DichVuMotCuaV2.DonThaoTac[]>([]);
  const [danhSachDataTable, setDanhSachDataTable] =
    useState<Record<string, { cauHinhBieuMau: DichVuMotCuaV2.CauHinhBieuMau[] }>[]>();
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [record, setRecord] = useState<DichVuMotCuaV2.BieuMau>();
  const [recordDon, setRecordDon] = useState<DichVuMotCuaV2.Don>();
  const [recordCauHinhBieuMau, setRecordCauHinhBieuMau] = useState<DichVuMotCuaV2.BieuMau>({
    ten: '',
    _id: '',
    ghiChu: '',
    cauHinhBieuMau: [],
    quyTrinh: {
      danhSachBuoc: [],
    },
  });
  const [recordDonThaoTac, setRecordDonThaoTac] = useState<DichVuMotCuaV2.DonThaoTac>();
  const [recordThongTinChung, setRecordThongTinChung] = useState<{
    thongTinThuTuc?: DichVuMotCuaV2.thongTinThuTuc;
    thongTinHoSo?: string;
    thongTinQuyTrinh?: string;
    thongTinYeuCau?: string;
  }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [thuTuc, setThuTuc] = useState<DichVuMotCuaV2.ThuTuc>();
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [visibleFormBieuMau, setVisibleFormBieuMau] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [current, setCurrent] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [typeForm, setTypeForm] = useState<string>('add');
  const [trangThaiQuanLyDon, setTrangThaiQuanLyDon] = useState<string>('PENDING');
  const [trangThaiQuanLyDonAdmin, setTrangThaiQuanLyDonAdmin] = useState<string>('PROCESSING');
  const [recordTrangThaiDon, setRecordTrangThaiDon] = useState<DichVuMotCuaV2.TrangThaiBuoc[]>([]);

  const getBieuMauAdminModel = async () => {
    setLoading(true);
    const response = await getBieuMauAdmin({ page, limit, condition });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getDonSinhVienModel = async () => {
    setLoading(true);
    const response = await getDonSinhVien({ page, limit, condition });
    setDanhSachDon(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getAllBieuMauModel = async () => {
    setLoading(true);
    const response = await userGetAllBieuMau();
    setDanhSach(response?.data?.data ?? []);
    setRecord(response?.data?.data?.[0]);
    setLoading(false);
  };

  const adminGetAllBieuMauModel = async () => {
    setLoading(true);
    const response = await adminGetAllBieuMau();
    setDanhSach(response?.data?.data ?? []);
    // setRecord(response?.data?.data?.[0]);
    setLoading(false);
  };

  const postBieuMauAdminModel = async (payload: DichVuMotCuaV2.BieuMau) => {
    try {
      setLoading(true);
      await postBieuMauAdmin(payload);
      message.success('Thêm thành công');
      setLoading(false);
      setVisibleForm(false);
      getBieuMauAdminModel();
    } catch (error) {
      setLoading(false);
    }
  };

  const putBieuMauAdminModel = async (payload: { data: DichVuMotCuaV2.BieuMau; id?: string }) => {
    try {
      setLoading(true);
      await putBieuMauAdmin(payload);
      message.success('Lưu thành công');
      setLoading(false);
      setVisibleForm(false);
      getBieuMauAdminModel();
    } catch (error) {
      setLoading(false);
    }
  };

  const deleteBieuMauAdminModel = async (id: string) => {
    if (!id) return;
    setLoading(true);
    await deleteBieuMauAdmin(id);
    message.success('Xóa thành công');
    setLoading(false);
    getBieuMauAdminModel();
  };

  const postDonSinhVienModel = async (payload: {
    duLieuBieuMau: DichVuMotCuaV2.CauHinhBieuMau[];
    dichVuId: string;
  }) => {
    try {
      setLoading(true);
      await postDonSinhVien(payload);
      message.success('Gửi đơn thành công');
      setLoading(false);
      setVisibleFormBieuMau(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getDonThaoTacChuyenVienDieuPhoiModel = async () => {
    setLoading(true);
    const response = await getDonThaoTacChuyenVienDieuPhoi({
      page,
      limit,
      condition: { ...condition, trangThai: trangThaiQuanLyDon, idDichVu: record?._id },
    });
    setDanhSachDonThaoTac(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  const chuyenVienDieuPhoiDuyetDonModel = async (payload: {
    type: string;
    idDonThaoTac: string;
    data: {
      urlFileDinhKem: string[];
    };
  }) => {
    await chuyenVienDieuPhoiDuyetDon(payload);
    message.success('Xử lý thành công');
    setVisibleFormBieuMau(false);
    getDonThaoTacChuyenVienDieuPhoiModel();
  };

  const getDonThaoTacChuyenVienXuLyModel = async () => {
    setLoading(true);
    const response = await getDonThaoTacChuyenVienXuLy({
      page,
      limit,
      condition: { ...condition, trangThai: trangThaiQuanLyDon, idDichVu: record?._id },
    });
    setDanhSachDonThaoTac(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  const adminGetDonModel = async () => {
    setLoading(true);
    const response = await adminGetDonSinhVien({
      page,
      limit,
      condition: {
        ...condition,
        trangThai: trangThaiQuanLyDonAdmin,
        'thongTinDichVu._id': record?._id,
      },
    });
    setDanhSachDon(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  const chuyenVienXuLyDuyetDonModel = async (payload: {
    type: string;
    idDonThaoTac: string;
    data: {
      urlFileDinhKem: string[];
    };
  }) => {
    await chuyenVienXuLyDuyetDon(payload);
    message.success('Xử lý thành công');
    setVisibleFormBieuMau(false);
    getDonThaoTacChuyenVienXuLyModel();
  };

  const getAllBieuMauChuyenVienDieuPhoiModel = async () => {
    const response = await getAllBieuMauChuyenVienDieuPhoi();
    setDanhSach(response?.data?.data ?? {});
  };

  const getAllBieuMauChuyenVienTiepNhanModel = async () => {
    const response = await getAllBieuMauChuyenVienTiepNhan();
    setDanhSach(response?.data?.data ?? {});
  };

  const dieuPhoiDonModel = async (payload: {
    idDonThaoTac: string;
    data: {
      nguoiDuocGiao: {
        _id: string;
        hoTen: string;
        gioiTinh: string;
        ngaySinh: string;
        maDinhDanh: string;
      };
    };
  }) => {
    try {
      setLoading(true);
      await dieuPhoiDon(payload);
      message.success('Điều phối thành công');
      setLoading(false);
      setVisibleFormBieuMau(false);
      getDonThaoTacChuyenVienDieuPhoiModel();
    } catch (error) {
      setLoading(false);
    }
  };

  const getTrangThaiDonModel = async (idDon: string) => {
    setLoading(true);
    const response = await getTrangThaiDon(idDon, { condition });
    setRecordTrangThaiDon(response?.data?.data ?? []);
    setLoading(false);
  };

  const adminGetTrangThaiDonModel = async (idDon: string) => {
    setLoading(true);
    const response = await adminGetTrangThaiDon(idDon, { condition });
    setRecordTrangThaiDon(response?.data?.data ?? []);
    setLoading(false);
  };

  const getBieuMauByIdModel = async (idBieuMau: string) => {
    const response = await getBieuMauById(idBieuMau);
    setRecord(response?.data?.data ?? {});
  };

  return {
    trangThaiQuanLyDonAdmin,
    setTrangThaiQuanLyDonAdmin,
    adminGetTrangThaiDonModel,
    adminGetDonModel,
    adminGetAllBieuMauModel,
    getBieuMauByIdModel,
    recordThongTinChung,
    setRecordThongTinChung,
    thuTuc,
    setThuTuc,
    getTrangThaiDonModel,
    recordTrangThaiDon,
    setRecordTrangThaiDon,
    dieuPhoiDonModel,
    getDonThaoTacChuyenVienXuLyModel,
    chuyenVienXuLyDuyetDonModel,
    danhSachDataTable,
    setDanhSachDataTable,
    recordDonThaoTac,
    setRecordDonThaoTac,
    getAllBieuMauChuyenVienDieuPhoiModel,
    getAllBieuMauChuyenVienTiepNhanModel,
    trangThaiQuanLyDon,
    setTrangThaiQuanLyDon,
    danhSachDonThaoTac,
    setDanhSachDonThaoTac,
    getDonThaoTacChuyenVienDieuPhoiModel,
    chuyenVienDieuPhoiDuyetDonModel,
    recordCauHinhBieuMau,
    setRecordCauHinhBieuMau,
    current,
    setCurrent,
    typeForm,
    setTypeForm,
    postDonSinhVienModel,
    danhSachDon,
    setDanhSachDon,
    recordDon,
    setRecordDon,
    getDonSinhVienModel,
    getAllBieuMauModel,
    visibleFormBieuMau,
    setVisibleFormBieuMau,
    deleteBieuMauAdminModel,
    putBieuMauAdminModel,
    postBieuMauAdminModel,
    getBieuMauAdminModel,
    danhSach,
    setDanhSach,
    filterInfo,
    setFilterInfo,
    condition,
    setCondition,
    record,
    setRecord,
    loading,
    setLoading,
    edit,
    setEdit,
    visibleForm,
    setVisibleForm,
    total,
    setTotal,
    page,
    limit,
    setPage,
    setLimit,
  };
};
