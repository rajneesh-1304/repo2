'use client';
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./dashboard/Navbar/Navbar";
import { RootState, AppDispatch } from "./redux/store";
import { setSearchValue, setCategory, setSubcategory } from "./redux/features/search/searchSlice";

export default function NavbarWrapper() {
  const dispatch = useDispatch<AppDispatch>();
  const { searchValue, category, subcategory } = useSelector((state: RootState) => state.search);

  return (
    <Navbar
      searchValue={searchValue}
      setSearchValue={(val: string) => dispatch(setSearchValue(val))}
      category={category}
      setCategory={(val: string) => dispatch(setCategory(val))}
      subcategory={subcategory}
      setSubcategory={(val: string) => dispatch(setSubcategory(val))}
    />
  );
}
