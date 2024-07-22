import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ServerUrl from "../reusable/ServerUrl";
import CreateRequest from "./CreateRequest";

function OrderPage1() {
  const navigation = useNavigate();
    const styleList = [
        { value: "Historic", name: "Historic" },
        { value: "Georgian", name: "Georgian" },
        { value: "Victorian", name: "Victorian" },
        { value: "Edwardian", name: "Edwardian" },
        { value: "Art nouveau", name: "Art Nouveau" },
        { value: "Art deco", name: "Art Deco" },
        { value: "Retro", name: "Retro" },
        { value: "Modernist", name: "Modernist" },
        { value: "Minimalistic", name: "Minimalistic" },
        { value: "Contemporary", name: "Contemporary" },
        { value: "Cultural", name: "Cultural" },
    ];

    const occasionList = [
        { value: "Engagement", name: "Engagement" },
        { value: "Wedding", name: "Wedding" },
        { value: "Anniversaries", name: "Anniversaries" },
        { value: "Birthdays", name: "Birthdays" },
        { value: "Formal Events", name: "Formal Events" },
        { value: "Working days", name: "Working days" },
        { value: "Dinner date", name: "Dinner date" },
        { value: "Holiday", name: "Holiday" },
        { value: "Informal gathering", name: "Informal gathering" },
        { value: "Everyday uses", name: "Everyday uses" },
    ];

    const jewelryTypeList = [
        { value: "Rings", name: "Rings" },
        { value: "Necklace", name: "Necklace" },
        { value: "Earrings", name: "Earrings" },
        { value: "Bracelet", name: "Bracelet" },
        { value: "Anklet", name: "Anklet" },
    ];

    const [formState, setFormState] = useState({
        selectedStyle: "",
        selectedType: "",
        selectedMetal: null,
        selectedMetalName: "",
        selectedMetalUnit: "",
        selectedGemstoneTypeId: "",
        selectedGemstoneType: null,
        selectedGemstoneShape: "",
        selectedGemstoneCut: "",
        selectedGemstoneClarity: "",
        selectedGemstoneColor: "",
        selectedGemstoneWeight: "0",
        selectedLength: "0",
        selectedTexture: "",
        selectedChainType: "",
        selectedOccasion: "",
        metalUnits: null,
    });

    const [showModal, setShowModal] = useState(false);
    const [productSpecId, setProductSpecId] = useState(null);

    const [metalData, setMetalData] = useState([]);
    const [metalName, setMetalName] = useState([]);
    const [metalUnit, setMetalUnit] = useState({});
    const [gemstoneData, setGemstoneData] = useState({
        types: [],
        shapes: [],
        cuts: [],
        clarities: [],
        colors: [],
    });

    useEffect(() => {
        const fetchPrice = async () => {
            try {
                const response = await axios.get(
                    `${ServerUrl}/api/gemstone/factors`
                );
                if (response.status === 200) {
                    const data = response.data.responseList;
                    setMetalData(data.metal);
                    setGemstoneData({
                        types: data.type,
                        shapes: data.shape,
                        cuts: data.cut,
                        clarities: data.clarity,
                        colors: data.color,
                    });
                }
            } catch (error) {
                console.error("Error fetching gemstone and metal:", error);
            }
        };

        fetchPrice();
    }, []);

    useEffect(() => {
        if (metalData.length > 0) {
            const uniqueMetalNames = [
                ...new Set(metalData.map((item) => item.name)),
            ];
            setMetalName(uniqueMetalNames);

            const unitsMap = {};
            uniqueMetalNames.forEach((name) => {
                unitsMap[name] = metalData
                    .filter((metal) => metal.name === name)
                    .map((metal) => metal.unit);
            });
            setMetalUnit(unitsMap);
        }
    }, [metalData]);

    useEffect(() => {
        if (formState.selectedMetalName) {
            const units = metalUnit[formState.selectedMetalName] || [];
            setFormState((prev) => ({
                ...prev,
                selectedMetalUnit: units[0],
                selectedMetal: null,
                metalUnits: units,
            }));
        }
    }, [formState]);

    useEffect(() => {
        const updateLength = () => {
            switch (formState.selectedType) {
                case "Necklace":
                    setFormState((prev) => ({ ...prev, selectedLength: "14" }));
                    break;
                case "Bracelet":
                    setFormState((prev) => ({ ...prev, selectedLength: "" }));
                    break;
                case "Earrings":
                    setFormState((prev) => ({ ...prev, selectedLength: "" }));
                    break;
                case "Anklet":
                    setFormState((prev) => ({ ...prev, selectedLength: "0" }));
                    break;
                case "Rings":
                    setFormState((prev) => ({
                        ...prev,
                        selectedLength: "0.618",
                    }));
                    break;
                default:
                    setFormState((prev) => ({ ...prev, selectedLength: "0" }));
            }
        };
        updateLength();
    }, [formState.selectedType]);

    useEffect(() => {
        if (formState.selectedGemstoneType) {
            setFormState((prev) => ({
                ...prev,
                selectedGemstoneShape: gemstoneData.shapes[0],
                selectedGemstoneCut: gemstoneData.cuts[0],
                selectedGemstoneClarity: gemstoneData.clarities[0],
                selectedGemstoneColor: gemstoneData.colors[0],
                selectedGemstoneWeight: "0.05",
            }));
        }
    }, [formState.selectedGemstoneType]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleChangeMetalUnit = (e) => {
        if (formState.selectedMetalName && formState.selectedMetalUnit) {
            const chosenMetal = metalData.find(
                (item) =>
                    item.name === formState.selectedMetalName &&
                    item.unit === formState.selectedMetalUnit
            );
            setFormState((prev) => ({
                ...prev,
                selectedMetalUnit: e.target.value,
                selectedMetal: chosenMetal,
            }));
        }
    };

    const handleChangeGemstoneType = (e) => {
        const typeId = e.target.value;

        setFormState((prev) => ({
            ...prev,
            selectedGemstoneTypeId: typeId,
            selectedGemstoneType: gemstoneData.types.find(
                (type) => type.id === parseInt(typeId, 10)
            ),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const productSpecification = {
            type: formState.selectedType,
            style: formState.selectedStyle,
            occasion: formState.selectedOccasion,
            length: formState.selectedLength,
            metal: formState.selectedMetal,
            texture: formState.selectedTexture,
            chainType: formState.selectedChainType,
            gemstone: {
                type: formState.selectedGemstoneType,
                shape: formState.selectedGemstoneShape.shape,
                cut: formState.selectedGemstoneCut.cutQuality,
                clarity: formState.selectedGemstoneClarity.clarity,
                color: formState.selectedGemstoneColor.color,
                caratWeight: formState.selectedGemstoneWeight,
            },
        };

        axios({
            method: "POST",
            url: `${ServerUrl}/api/products/customize`,
            headers: { "Content-Type": "application/json" },
            data: productSpecification,
        })
            .then((response) => {
                setProductSpecId(
                    response.data.responseList.productSpecification.id
                );
                setShowModal(true);
            })
            .catch((error) => {
                console.log("There is an error in this code" + error);
            });
    };

    const handleDisable = () => {
        const {
            selectedStyle,
            selectedOccasion,
            selectedType,
            selectedMetalName,
            selectedLength,
            selectedGemstoneType,
            selectedGemstoneShape,
            selectedGemstoneCut,
            selectedGemstoneClarity,
            selectedGemstoneColor,
            selectedGemstoneWeight,
        } = formState;

        return !(
            selectedStyle &&
            selectedOccasion &&
            selectedType &&
            selectedMetalName &&
            selectedLength !== "0" &&
            selectedLength &&
            selectedGemstoneType &&
            selectedGemstoneShape &&
            selectedGemstoneCut &&
            selectedGemstoneClarity &&
            selectedGemstoneColor &&
            selectedGemstoneWeight
        );
    };

    const handleRequestCanceled = (e) => {
        setShowModal(false);
        if (productSpecId) {
            axios
                .delete(`${ServerUrl}/api/products/customize/${productSpecId}`)
                .then((response) => {
                    console.log("Product specification removed successfully");
                })
                .catch((error) => {
                    console.error(
                        "Error removing product specification:",
                        error
                    );
                });
        }
    };

    return (
        <Container style={{ paddingInline: "10%" }}>
            <h3 className="fw-bold" style={{ margin: "30px 0px 30px" }}>
                Create Your Dream Jewelry.
            </h3>
            <Form onSubmit={handleSubmit} className="mb-5">
                {/* Design Style */}
                <Form.Group className="mb-3">
                    <Form.Label>Design style*</Form.Label>
                    <Form.Select
                        name="selectedStyle"
                        value={formState.selectedStyle}
                        size="sm"
                        onChange={handleChange}
                    >
                        <option value="" disabled>
                            Choose one
                        </option>
                        {styleList.map((style, index) => (
                            <option key={index} value={style.value}>
                                {style.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {/* Occasion */}
                <Form.Group className="mb-3">
                    <Form.Label>Occasion*</Form.Label>
                    <Form.Select
                        name="selectedOccasion"
                        value={formState.selectedOccasion}
                        size="sm"
                        onChange={handleChange}
                    >
                        <option value="" disabled>
                            Choose one
                        </option>
                        {occasionList.map((occasion, index) => (
                            <option key={index} value={occasion.value}>
                                {occasion.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {/* Jewelry Type */}
                <Form.Group className="mb-3">
                    <Form.Label>Jewelry type*</Form.Label>
                    <Form.Select
                        name="selectedType"
                        size="sm"
                        value={formState.selectedType}
                        onChange={handleChange}
                    >
                        <option value="" disabled>
                            Choose one
                        </option>
                        {jewelryTypeList.map((type, index) => (
                            <option key={index} value={type.value}>
                                {type.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {/* Conditional Rendering */}
                {formState.selectedType && (
                    <>
                        {/* Length */}
                        <Form.Group className="mb-3">
                            {formState.selectedType === "Necklace" && (
                                <>
                                    <Form.Label>
                                        Necklace Length:{" "}
                                        {formState.selectedLength}"
                                    </Form.Label>
                                    <Form.Range
                                        name="selectedLength"
                                        step="1"
                                        min="14"
                                        max="42"
                                        value={formState.selectedLength}
                                        onChange={handleChange}
                                    />
                                </>
                            )}
                            {formState.selectedType === "Bracelet" && (
                                <>
                                    <Form.Label>Bracelet Size</Form.Label>
                                    <Form.Select
                                        name="selectedLength"
                                        value={formState.selectedLength}
                                        onChange={handleChange}
                                        size="sm"
                                    >
                                        <option value="" disabled>
                                            Choose one
                                        </option>
                                        <option value="XS">X-Small</option>
                                        <option value="S">Small</option>
                                        <option value="M">Medium</option>
                                        <option value="L">Large</option>
                                        <option value="XL">X-Large</option>
                                        <option value="XXL">XX-Large</option>
                                        <option value="XXXL">XXX-Large</option>
                                    </Form.Select>
                                    <Form.Text muted>
                                        X-Small: 4.76-5.25". | Small:
                                        5.26-5.75". | Medium: 5.76-6.25". |
                                        Large: 6.26-6.75".{<br />}X-Large:
                                        6.76-7.25". | XX-Large: 7.26–7.75". |
                                        XXX-Large: 7.76–8.25".{" "}
                                    </Form.Text>
                                </>
                            )}
                            {formState.selectedType === "Anklet" && (
                                <>
                                    <Form.Label>
                                        Anklet Size: {formState.selectedLength}"
                                    </Form.Label>
                                    <Form.Range
                                        name="selectedLength"
                                        step="1"
                                        min="0"
                                        max="10"
                                        value={formState.selectedLength}
                                        onChange={handleChange}
                                    />
                                </>
                            )}
                            {formState.selectedType === "Rings" && (
                                <>
                                    <Form.Label>
                                        Rings inside diameters:{" "}
                                        {formState.selectedLength}"
                                    </Form.Label>
                                    <Form.Range
                                        name="selectedLength"
                                        step="0.001"
                                        min="0.618"
                                        max="0.846"
                                        value={formState.selectedLength}
                                        onChange={handleChange}
                                    />
                                </>
                            )}
                            {formState.selectedType === "Earrings" && (
                                <>
                                    <Form.Label>Earrings size</Form.Label>
                                    <Form.Select
                                        name="selectedLength"
                                        value={formState.selectedLength}
                                        onChange={handleChange}
                                        size="sm"
                                    >
                                        <option value="" disabled>
                                            Choose one
                                        </option>
                                        <option value="S">Small</option>
                                        <option value="M">Medium</option>
                                        <option value="L">Large</option>
                                        <option value="XL">X-Large</option>
                                    </Form.Select>
                                    <Form.Text muted>
                                        Small: 0.393-1.181". | Medium:
                                        1.575-1.968". | Large: 2.559-3.149". |
                                        X-Large: Over 3.149".
                                    </Form.Text>
                                </>
                            )}
                        </Form.Group>
                    </>
                )}
                {/* Metal */}
                {formState.selectedType && (
                    <>
                        {/* Metal Name */}
                        <h5 className="pt-1">Material</h5>
                        <Form.Group className="mb-3">
                            <Form.Label>Metal*</Form.Label>
                            <Form.Select
                                name="selectedMetalName"
                                value={formState.selectedMetalName}
                                onChange={handleChange}
                                size="sm"
                            >
                                <option value="" disabled>
                                    Choose one
                                </option>
                                {metalName.map((metal, index) => (
                                    <option key={index} value={metal}>
                                        {metal}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {formState.selectedMetalName && (
                            <>
                                {/* Metal Units */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Metal Unit</Form.Label>
                                    <Form.Select
                                        name="selectedMetalUnit"
                                        value={formState.selectedMetalUnit}
                                        onChange={handleChangeMetalUnit}
                                        size="sm"
                                    >
                                        {formState.metalUnits &&
                                            formState.metalUnits.map(
                                                (unit, index) => (
                                                    <option
                                                        key={index}
                                                        value={unit}
                                                    >
                                                        {unit}
                                                    </option>
                                                )
                                            )}
                                    </Form.Select>
                                </Form.Group>

                                {/* Metal Texture */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Texture</Form.Label>
                                    <Form.Select
                                        name="selectedTexture"
                                        value={formState.selectedTexture}
                                        onChange={handleChange}
                                        size="sm"
                                    >
                                        <option value="Default">Default</option>
                                        <option value="Polished">
                                            Polished
                                        </option>
                                        <option value="Satin">Satin</option>
                                        <option value="Brushed">Brushed</option>
                                        <option value="Wire Brushed">
                                            Wire Brushed
                                        </option>
                                        <option value="Sand Blasted">
                                            Sand Blasted
                                        </option>
                                        <option value="Bead Blasted">
                                            Bead Blasted
                                        </option>
                                        <option value="Stone">Stone</option>
                                        <option value="Hammered">
                                            Hammered
                                        </option>
                                        <option value="Florentine">
                                            Florentine
                                        </option>
                                    </Form.Select>
                                </Form.Group>

                                {/* Chain Type */}
                                {["Rings", "Earrings"].includes(
                                    formState.selectedType
                                ) && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Chain Type</Form.Label>
                                        <Form.Select
                                            name="selectedChainType"
                                            size="sm"
                                            value={formState.selectedChainType}
                                            onChange={handleChange}
                                        >
                                            <option value="Default">
                                                Default
                                            </option>
                                            <option value="Bead">Bead</option>
                                            <option value="Box">Box</option>
                                            <option value="Byzantine">
                                                Byzantine
                                            </option>
                                            <option value="Cable">Cable</option>
                                            <option value="Solid Cable">
                                                Solid Cable
                                            </option>
                                            <option value="Curb">Curb</option>
                                            <option value="Figaro">
                                                Figaro
                                            </option>
                                            <option value="Mesh">Mesh</option>
                                            <option value="Omega">Omega</option>
                                            <option value="Palma">Palma</option>
                                            <option value="Popcorn">
                                                Popcorn
                                            </option>
                                            <option value="Rolo">Rolo</option>
                                            <option value="Rope">Rope</option>
                                            <option value="San Marco">
                                                San Marco
                                            </option>
                                            <option value="Singapore">
                                                Singapore
                                            </option>
                                            <option value="Snake">Snake</option>
                                            <option value="Wheat">Wheat</option>
                                        </Form.Select>
                                    </Form.Group>
                                )}
                            </>
                        )}
                    </>
                )}

                {/* Gemstone */}
                {["Rings", "Necklace", "Earrings"].includes(
                    formState.selectedType
                ) && (
                    <>
                        <h5 className="pt-1">Gemstone</h5>
                        {/* Gemstone Type */}
                        <Form.Group className="mb-3">
                            <Form.Label>Gemstone</Form.Label>
                            <Form.Select
                                name="selectedGemstoneTypeId"
                                value={formState.selectedGemstoneTypeId}
                                onChange={handleChangeGemstoneType}
                                size="sm"
                            >
                                <option value="">None</option>
                                {gemstoneData.types.map((type, index) => (
                                    <option key={index} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {formState.selectedGemstoneType && (
                            <>
                                {/* Gemstone Shape */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Gemstone Shape</Form.Label>
                                    <Form.Select
                                        name="selectedGemstoneShape"
                                        value={formState.selectedGemstoneShape}
                                        onChange={handleChange}
                                        size="sm"
                                    >
                                        {gemstoneData.shapes.map(
                                            (shape, index) => (
                                                <option
                                                    key={index}
                                                    value={shape.shape}
                                                >
                                                    {shape.shape}
                                                </option>
                                            )
                                        )}
                                    </Form.Select>
                                </Form.Group>

                                {/* Gemstone Cut */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Gemstone Cut</Form.Label>
                                    <Form.Select
                                        name="selectedGemstoneCut"
                                        value={formState.selectedGemstoneCut}
                                        onChange={handleChange}
                                        size="sm"
                                    >
                                        {gemstoneData.cuts.map((cut, index) => (
                                            <option
                                                key={index}
                                                value={cut.cutQuality}
                                            >
                                                {cut.cutQuality}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                {/* Gemstone Clarity */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Gemstone Clarity</Form.Label>
                                    <Form.Select
                                        name="selectedGemstoneClarity"
                                        value={
                                            formState.selectedGemstoneClarity
                                        }
                                        onChange={handleChange}
                                        size="sm"
                                    >
                                        {gemstoneData.clarities.map(
                                            (clarity, index) => (
                                                <option
                                                    key={index}
                                                    value={clarity.clarity}
                                                >
                                                    {clarity.clarity}
                                                </option>
                                            )
                                        )}
                                    </Form.Select>
                                </Form.Group>

                                {/* Gemstone Color */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Gemstone Color</Form.Label>
                                    <Form.Select
                                        name="selectedGemstoneColor"
                                        value={formState.selectedGemstoneColor}
                                        onChange={handleChange}
                                        size="sm"
                                    >
                                        {gemstoneData.colors.map(
                                            (color, index) => (
                                                <option
                                                    key={index}
                                                    value={color.color}
                                                >
                                                    {color.color}
                                                </option>
                                            )
                                        )}
                                    </Form.Select>
                                </Form.Group>

                                {/* Gemstone Carat Weight */}
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Gemstone Weight:{" "}
                                        {formState.selectedGemstoneWeight}{" "}
                                        carats
                                    </Form.Label>
                                    <Form.Range
                                        name="selectedGemstoneWeight"
                                        step="0.05"
                                        min="0"
                                        max="5"
                                        value={formState.selectedGemstoneWeight}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </>
                        )}
                    </>
                )}

                <Button type="submit" disabled={handleDisable()}>
                    Next Step
                </Button>
            </Form>
            <Modal show={showModal} onHide={handleRequestCanceled} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Create Request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateRequest productSpecId={productSpecId} onClose={handleRequestCanceled} />
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default OrderPage1;
