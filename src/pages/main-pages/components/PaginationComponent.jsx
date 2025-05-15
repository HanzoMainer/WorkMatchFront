import { Pagination } from "@mui/material";

const PaginationComponent = ({ count, page, onChange }) => {
    return (
        <Pagination
            count={count}
            page={page}
            onChange={onChange}
            sx={{
                mt: 3,
                display: "flex",
                justifyContent: "center",
                marginBottom: "3%",
            }}
        />
    );
};

export default PaginationComponent;
