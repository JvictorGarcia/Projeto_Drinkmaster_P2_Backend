import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Chip,
    CircularProgress,
    Container,
    Grid,
    TextField,
    Typography,
    MenuItem,

} from "@mui/material";
//import { buscarDrinksPorNome } from "../contexts/drinkApi";
import {
    buscarDrinksBackend,
    listarDrinks,
    criarDrink,
    atualizarDrink,
    excluirDrink,
    buscarImagemCocktail,
} from "../contexts/backendApi";
import { useDrink } from "../contexts/DrinkContext";

export default function DrinkSearch() {
    const [termoBusca, setTermoBusca] = useState("");
    const [novoDrink, setNovoDrink] = useState({
        nome: "",
        categoria: "",
        tipo: "",
        copo: "",
        instrucoes: "",
        imagem: "",
    });// local que guarda o texto digitado no campo de busca
    const [drinkEditandoId, setDrinkEditandoId] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const { drinks, setDrinks, loading, setLoading, erro, setErro, token } =
        useDrink();
    // useMemo usado para ordenar os drinks por nome
    // Ele só recalcula quando a lista de drinks mudar
    const drinksOrdenados = useMemo(() => {
        return [...drinks].sort((a, b) => a.nome.localeCompare(b.nome));
    }, [drinks]);

    async function carregarDrinks() {
        try {
            setLoading(true);
            setErro("");

            const resultado = await listarDrinks(token);

            setDrinks(resultado);
        } catch {
            setErro("Erro ao carregar drinks.");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (token) {
            carregarDrinks();
        }
    }, [token]);

    // Validação: impede a busca se o campo estiver vazio
    async function buscarDrinks() {
        if (!termoBusca.trim()) {
            await carregarDrinks();
            return;
        }

        try {
            setLoading(true);
            setErro("");
            setDrinks([]);

            const resultado = termoBusca.trim()
                ? await buscarDrinksBackend(termoBusca, token)
                : await listarDrinks(token);  // Chama a função que busca os dados na API

            if (resultado.length === 0) {
                setErro("Nenhum drink encontrado com esse nome.");
                return;
            }

            setDrinks(resultado);// Salva os drinks encontrados no contexto
        } catch {
            setErro("Erro ao buscar drinks. Tente novamente.");
        } finally {
            setLoading(false);// Desativa o carregamento no final da busca
        }
    }
    async function cadastrarDrink() {
        if (
            !novoDrink.nome ||
            !novoDrink.categoria ||
            !novoDrink.tipo ||
            !novoDrink.copo ||
            !novoDrink.instrucoes
        ) {
            setErro("Preencha todos os campos obrigatórios.");
            return;
        }

        try {
            setLoading(true);
            setErro("");

            let imagemFinal = novoDrink.imagem;

            if (!imagemFinal) {
                imagemFinal = await buscarImagemCocktail(novoDrink.nome);
            }

            await criarDrink(
                {
                    ...novoDrink,
                    imagem:
                        imagemFinal ||
                        "https://www.thecocktaildb.com/images/media/drink/wpxpvu1439905379.jpg",
                },
                token
            );

            setNovoDrink({
                nome: "",
                categoria: "",
                tipo: "",
                copo: "",
                instrucoes: "",
                imagem: "",
            });
            setMostrarFormulario(false);

            const resultado = await listarDrinks(token);
            setDrinks(resultado);
        } catch {
            setErro("Erro ao cadastrar drink.");
        } finally {
            setLoading(false);
        }
    }
    async function removerDrink(id) {
        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este drink?"
        );

        if (!confirmar) return;

        try {
            setLoading(true);

            await excluirDrink(id, token);

            const resultado = await listarDrinks(token);

            setDrinks(resultado);
        } catch {
            setErro("Erro ao excluir drink.");
        } finally {
            setLoading(false);
        }
    }
    function prepararEdicao(drink) {
        setDrinkEditandoId(drink.id);
        setMostrarFormulario(true);

        setNovoDrink({
            nome: drink.nome,
            categoria: drink.categoria,
            tipo: drink.tipo,
            copo: drink.copo,
            instrucoes: drink.instrucoes,
            imagem: drink.imagem || "",
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }
    async function salvarEdicao() {
        if (
            !novoDrink.nome ||
            !novoDrink.categoria ||
            !novoDrink.tipo ||
            !novoDrink.copo ||
            !novoDrink.instrucoes
        ) {
            setErro("Preencha todos os campos obrigatórios.");
            return;
        }

        try {
            setLoading(true);
            setErro("");

            await atualizarDrink(drinkEditandoId, novoDrink, token);

            setDrinkEditandoId(null);
            setMostrarFormulario(false);

            setNovoDrink({
                nome: "",
                categoria: "",
                tipo: "",
                copo: "",
                instrucoes: "",
                imagem: "",
            });

            const resultado = await listarDrinks(token);
            setDrinks(resultado);
        } catch {
            setErro("Erro ao atualizar drink.");
        } finally {
            setLoading(false);
        }
    }
    function cancelarEdicao() {
        setDrinkEditandoId(null);

        setNovoDrink({
            nome: "",
            categoria: "",
            tipo: "",
            copo: "",
            instrucoes: "",
            imagem: "",
        });


        setErro("");
        setMostrarFormulario(false);
    }

    function traduzirCategoria(categoria) {
        const traducoes = {
            Cocktail: "Coquetel",
            "Ordinary Drink": "Drink Tradicional",
            Shot: "Dose",
            Beer: "Cerveja",
            Coffee: "Café",
            Tea: "Chá",
            "Coffee / Tea": "Café / Chá",
            Soft_Drink: "Refrigerante",
            Cocoa: "Chocolate",
            Milk: "Leite",
            Punch: "Ponche",
            Homemade_Liqueur: "Licor Caseiro",
            Other: "Outros",
        };

        return traducoes[categoria] || categoria;
    }

    function traduzirTipo(tipo) {
        const traducoes = {
            Alcoholic: "Alcoólico",
            "Non alcoholic": "Não é alcoólico",
            Optional_alcohol: "Álcool é opcional",
        };

        return traducoes[tipo] || tipo;
    }
    return (
        <Container maxWidth="lg">
            <Box sx={{ pt: 6, textAlign: "center" }}>
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 700,
                        mb: 1,
                        letterSpacing: 1,
                    }}
                >
                    DrinkMaster
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        mb: 4,
                        color: "#d6d6d6",
                    }}
                >
                    Busque drinks e veja receitas, ingredientes e imagens.
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "center",
                        alignItems: "center",
                        mb: 4,
                        flexWrap: "wrap",
                    }}
                >
                    <TextField
                        label="Nome do drink"
                        placeholder="Ex: margarita, mojito, martini"
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}  // Atualiza o estado a cada letra digitada
                        onKeyDown={(e) => {
                            if (e.key === "Enter") buscarDrinks();// Permite buscar apertando Enter
                        }}
                        variant="filled"
                        InputLabelProps={{
                            sx: {
                                top: "2px",
                            },
                        }}
                        sx={{
                            width: { xs: "100%", sm: 320 },
                            background: "white",
                            borderRadius: 2,

                            "& .MuiFilledInput-root": {
                                backgroundColor: "white",
                                borderRadius: 2,
                            },

                            "& .MuiInputLabel-root": {
                                color: "#555",
                            },

                            "& .MuiInputLabel-root.Mui-focused": {
                                color: "#ff9800",
                            },
                        }}
                    />

                    <Button
                        variant="contained"
                        onClick={buscarDrinks}
                        sx={{
                            height: 56,
                            px: 4,
                            borderRadius: 2,
                            fontWeight: 700,
                            background: "#ff9800",
                            "&:hover": {
                                background: "#f57c00",
                            },
                        }}
                    >
                        Buscar
                    </Button>
                </Box>

                {erro && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {erro}
                    </Alert>
                )}

                {loading && (
                    <Box sx={{ mb: 3 }}>
                        <CircularProgress />
                    </Box>
                )}
                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            if (mostrarFormulario) {
                                cancelarEdicao();
                            } else {
                                setMostrarFormulario(true);
                                setDrinkEditandoId(null);

                                setNovoDrink({
                                    nome: "",
                                    categoria: "",
                                    tipo: "",
                                    copo: "",
                                    instrucoes: "",
                                    imagem: "",
                                });
                            }
                        }}
                        sx={{
                            height: 52,
                            px: 5,
                            borderRadius: 2,
                            background: "#ff9800",
                            fontWeight: 700,
                            "&:hover": {
                                background: "#f57c00",
                            },
                        }}
                    >
                        + Novo Drink
                    </Button>
                </Box>
                {mostrarFormulario && (
                    <Box
                        sx={{
                            mt: 4,
                            mb: 6,
                            p: { xs: 2.5, md: 4 },
                            background: "rgba(255,255,255,0.09)",
                            borderRadius: 5,
                            border: "1px solid rgba(255,255,255,0.18)",
                            boxShadow: "0 18px 40px rgba(0,0,0,0.28)",
                        }}
                    >

                        <Typography
                            variant="h5"
                            sx={{
                                mb: 3,
                                fontWeight: 700,
                                textAlign: "center",
                            }}
                        >
                            {drinkEditandoId ? " Editar drink" : " Cadastrar novo drink"}
                        </Typography>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "1fr 1fr 1fr",
                                },
                                gap: 2.5,
                                alignItems: "start",
                            }}
                        >
                            <TextField
                                fullWidth
                                placeholder="Nome do drink"
                                value={novoDrink.nome}
                                onChange={(e) =>
                                    setNovoDrink({ ...novoDrink, nome: e.target.value })
                                }
                                sx={{
                                    background: "white",
                                    borderRadius: 2,
                                    "& input::placeholder": {
                                        color: "#777",
                                        opacity: 1,
                                    },
                                }}
                            />

                            <TextField
                                fullWidth
                                placeholder="Categoria"
                                value={novoDrink.categoria}
                                onChange={(e) =>
                                    setNovoDrink({ ...novoDrink, categoria: e.target.value })
                                }
                                sx={{ background: "white", borderRadius: 2 }}
                            />

                            <TextField
                                select
                                fullWidth
                                value={novoDrink.tipo}
                                onChange={(e) =>
                                    setNovoDrink({ ...novoDrink, tipo: e.target.value })
                                }
                                SelectProps={{
                                    displayEmpty: true,
                                }}
                                sx={{
                                    background: "white",
                                    borderRadius: 2,
                                    textAlign: "left",
                                }}
                            >
                                <MenuItem value="" disabled>
                                    Selecione o tipo
                                </MenuItem>
                                <MenuItem value="Alcoólico">Alcoólico</MenuItem>
                                <MenuItem value="Não alcoólico">Não alcoólico</MenuItem>
                            </TextField>

                            <TextField
                                fullWidth
                                placeholder="Copo"
                                value={novoDrink.copo}
                                onChange={(e) =>
                                    setNovoDrink({ ...novoDrink, copo: e.target.value })
                                }
                                sx={{ background: "white", borderRadius: 2 }}
                            />

                            <TextField
                                fullWidth
                                placeholder="URL da imagem (opcional)"
                                value={novoDrink.imagem}
                                onChange={(e) =>
                                    setNovoDrink({ ...novoDrink, imagem: e.target.value })
                                }
                                sx={{
                                    background: "white",
                                    borderRadius: 2,
                                    gridColumn: {
                                        xs: "span 1",
                                        md: "span 2",
                                    },
                                    "& input::placeholder": {
                                        color: "#777",
                                        opacity: 1,
                                    },
                                }}
                            />

                            <TextField
                                fullWidth
                                multiline
                                rows={5}
                                placeholder="Digite as instruções do drink..."
                                value={novoDrink.instrucoes}
                                onChange={(e) =>
                                    setNovoDrink({
                                        ...novoDrink,
                                        instrucoes: e.target.value,
                                    })
                                }
                                sx={{
                                    background: "white",
                                    borderRadius: 2,
                                    gridColumn: {
                                        xs: "span 1",
                                        md: "span 2",
                                    },
                                    "& textarea::placeholder": {
                                        color: "#777",
                                        opacity: 1,
                                    },
                                }}
                            />

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                    justifyContent: "flex-start",
                                }}
                            >
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={drinkEditandoId ? salvarEdicao : cadastrarDrink}
                                    sx={{
                                        height: 56,
                                        borderRadius: 2,
                                        background: "#ff9800",
                                        fontWeight: 700,
                                        "&:hover": {
                                            background: "#f57c00",
                                        },
                                    }}
                                >
                                    {drinkEditandoId ? "Salvar alterações" : "Cadastrar Drink"}
                                </Button>

                                {drinkEditandoId && (
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="error"
                                        onClick={cancelarEdicao}
                                        sx={{
                                            height: 56,
                                            borderRadius: 2,
                                            fontWeight: 700,
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Box>
                )}

                <Grid container spacing={3} justifyContent="center">
                    {drinksOrdenados.map((drink) => (
                        <Grid item xs={12} sm={6} md={4} key={drink.id}>
                            <Card
                                sx={{
                                    width: "100%",
                                    maxWidth: 360,
                                    mx: "auto",
                                    height: 560,
                                    background: "rgba(30, 30, 30, 0.95)",
                                    color: "white",
                                    borderRadius: 4,
                                    overflow: "hidden",
                                    boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
                                    transition: "0.3s",
                                    display: "flex",
                                    flexDirection: "column",

                                    border: "2px solid transparent",
                                    backgroundImage:
                                        "linear-gradient(#1e1e1e, #1e1e1e), linear-gradient(135deg, #ff9800, #ff4081, #7c4dff)",
                                    backgroundOrigin: "border-box",
                                    backgroundClip: "padding-box, border-box",

                                    "&:hover": {
                                        transform: "translateY(-8px) scale(1.02)",
                                        boxShadow: "0 18px 40px rgba(0,0,0,0.5)",
                                    },
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image={
                                        drink.imagem ||
                                        "https://www.thecocktaildb.com/images/media/drink/wpxpvu1439905379.jpg"
                                    }
                                    alt={drink.nome}
                                    sx={{
                                        height: 230,
                                        objectFit: "cover",
                                    }}
                                />

                                <CardContent
                                    sx={{
                                        p: 3,
                                        textAlign: "left",
                                        display: "flex",
                                        flexDirection: "column",
                                        flexGrow: 1,
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 1,
                                            minHeight: 64,
                                        }}
                                    >
                                        {drink.nome}{/* Nome do drink */}
                                    </Typography>

                                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                                        <Chip
                                            label={traduzirCategoria(drink.categoria) || "Sem categoria"}
                                            size="medium"
                                            sx={{
                                                background: "#ff9800",
                                                color: "white",
                                                fontWeight: 600,
                                                maxWidth: "100%",
                                                ".MuiChip-label": {
                                                    px: 1.5,
                                                },
                                            }}
                                        />

                                        <Chip
                                            label={traduzirTipo(drink.tipo) || "Tipo não informado"}
                                            size="medium"
                                            sx={{
                                                background: "#37474f",
                                                color: "white",
                                                fontWeight: 600,
                                                maxWidth: "100%",
                                                ".MuiChip-label": {
                                                    px: 1.5,
                                                },
                                            }}
                                        />
                                    </Box>
                                    {/* Informações adicionais */}
                                    <Typography
                                        variant="body2"
                                        sx={{ color: "#cfcfcf", mb: 1 }}
                                    >
                                        <strong>Copo:</strong> {drink.copo}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#e0e0e0",
                                            lineHeight: 1.6,
                                            overflow: "hidden",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 5,
                                            WebkitBoxOrient: "vertical",
                                        }}
                                    >
                                        {drink.instrucoes}
                                    </Typography>
                                    <Box
                                        sx={{
                                            mt: "auto",
                                            pt: 2,
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            gap: 1,
                                        }}
                                    >
                                        <Button
                                            variant="outlined"
                                            color="warning"
                                            onClick={() => prepararEdicao(drink)}
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            Editar
                                        </Button>

                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => removerDrink(drink.id)}
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            Excluir
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
}