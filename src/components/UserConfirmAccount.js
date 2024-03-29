import React from "react";
import clsx from "clsx";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormHelperText,
  Grid,
  TextField,
  makeStyles,
} from "@material-ui/core";
import { useLocation } from "react-router";
import { useSnackbar } from "notistack";
import { firebaseUrl } from "../constant";

const useStyles = makeStyles(() => ({
  root: {},
}));

export default function ConfirmAccount({ className, ...rest }) {
  const classes = useStyles();
  const location = useLocation();
  const paramId = location.search.split("=")[1];
  const { enqueueSnackbar } = useSnackbar();

  if (!paramId) return null;
  console.log(paramId);
  return (
    <Formik
      initialValues={{
        password: "",
        passwordConfirm: "",
        mail: "",
      }}
      validationSchema={Yup.object().shape({
        password: Yup.string()
          .min(7, "Au minimum 8 caractères")
          .max(255)
          .required("obligatoire"),
        passwordConfirm: Yup.string()
          .oneOf(
            [Yup.ref("password"), null],
            "les mot de passe doivent etre égaux"
          )
          .required("obligatoire"),
        mail: Yup.string()
          .email("doit etre un email valide")
          .required("obligatoire"),
      })}
      onSubmit={async (
        values,
        { resetForm, setErrors, setStatus, setSubmitting }
      ) => {
        try {
          const data = await fetch(`${firebaseUrl}signin`, {
            method: "POST",
            body: JSON.stringify({
              password: values.password,
              uuid: paramId,
              email: values.mail,
            }),
            headers: {
              "content-type": "application/json",
            },
          });
          if (data.status !== 201 && data.status !== 200) throw "Nom d'utilisateur invalide";
          enqueueSnackbar(
            "Vous pouvez maitenant vous connecter sur votre application mobile",
            {
              variant: "success",
            }
          );
          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
        } catch (error) {
          enqueueSnackbar(error, {
            variant: "error",
          });
          setStatus({ success: false });
          setErrors({ submit: error.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <form onSubmit={handleSubmit}>
          <Card className={clsx(classes.root, className)} {...rest}>
            <CardHeader title="Crée votre mot de passe" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={4} sm={6} xs={12}>
                  <TextField
                    error={Boolean(touched.mail && errors.mail)}
                    fullWidth
                    helperText={touched.mail && errors.mail}
                    label="Email"
                    name="mail"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    value={values.mail}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <TextField
                    error={Boolean(touched.password && errors.password)}
                    fullWidth
                    helperText={touched.password && errors.password}
                    label="Mot de passe"
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="password"
                    value={values.password}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <TextField
                    error={Boolean(
                      touched.passwordConfirm && errors.passwordConfirm
                    )}
                    fullWidth
                    helperText={
                      touched.passwordConfirm && errors.passwordConfirm
                    }
                    label="Confirmation"
                    name="passwordConfirm"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="password"
                    value={values.passwordConfirm}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              {errors.submit && (
                <Box mt={3}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Box>
              )}
            </CardContent>
            <Divider />
            <Box p={2} display="flex" justifyContent="flex-end">
              <Button
                color="secondary"
                disabled={isSubmitting}
                type="submit"
                variant="contained"
              >
                crée votre mot de passe
              </Button>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
}
